import { ticketPool } from "../../../../db.js";

//USERS

export async function getUserAnnouncementsService(queryParams) {
  const { search = "", category = "" } = queryParams;

  const conditions = [];
  const values = [];

  let query = `
    SELECT

      a.announcement_id,

      a.title,

      a.category,

      a.content,

      a.publish_date,

      a.is_pinned,

      u.d_name AS posted_by,

      COUNT(f.file_id) AS attachment_count

    FROM tbl_announcements a

    LEFT JOIN "tbl_userAccounts" u
      ON a.posted_by = u.user_id

    LEFT JOIN tbl_announcement_files f
      ON a.announcement_id = f.announcement_id
  `;

  conditions.push(`a.is_published = TRUE`);

  conditions.push(`
    (
      a.expiry_date IS NULL

      OR

      a.expiry_date >= CURRENT_DATE
    )
  `);

  if (search) {
    values.push(`%${search}%`);

    conditions.push(`
      (
        a.title ILIKE $${values.length}

        OR

        a.content ILIKE $${values.length}
      )
    `);
  }

  if (category) {
    values.push(category);

    conditions.push(`
      a.category = $${values.length}
    `);
  }

  query += `
    WHERE ${conditions.join(" AND ")}

    GROUP BY
      a.announcement_id,
      u.d_name

    ORDER BY

      a.is_pinned DESC,

      a.publish_date DESC
  `;

  const result = await ticketPool.query(query, values);
  return result.rows;
}

export async function getUserAnnouncementByIdService(announcementId) {
  const announcementResult = await ticketPool.query(
    `
    SELECT
      a.announcement_id,
      a.title,
      a.category,
      a.content,
      a.publish_date,
      a.is_pinned,
      u.d_name AS posted_by
    FROM tbl_announcements a
    LEFT JOIN "tbl_userAccounts" u
      ON a.posted_by=u.user_id
    WHERE
      a.announcement_id=$1
      AND a.is_published=TRUE
      AND (a.expiry_date IS NULL OR a.expiry_date>=CURRENT_DATE)
    `,
    [announcementId],
  );

  if (!announcementResult.rowCount) {
    throw new Error("Announcement not found.");
  }

  const files = await ticketPool.query(
    `
      SELECT
        file_id,
        original_filename,
        file_type,
        file_size
      FROM tbl_announcement_files
      WHERE announcement_id=$1
      ORDER BY file_id

    `,
    [announcementId],
  );

  return {
    ...announcementResult.rows[0],
    files: files.rows,
  };
}

export async function downloadAnnouncementFileService(fileId) {
  const result = await ticketPool.query(
    `
    SELECT
      file_id,
      original_filename,
      file_type,
      file_data
    FROM tbl_announcement_files
    WHERE file_id=$1
    `,
    [fileId],
  );

  if (!result.rowCount) {
    throw new Error("File not found");
  }

  return result.rows[0];
}

//DASHBOARD
export async function getAnnouncementDashboardService() {
  const result = await ticketPool.query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE is_published = TRUE)::int AS published,
      COUNT(*) FILTER (WHERE is_published = FALSE)::int AS drafts,
      COUNT(*) FILTER (WHERE is_pinned = TRUE)::int AS pinned,
      COUNT(*) FILTER (WHERE expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE)::int AS expired,
      (
        SELECT COUNT(*)
        FROM tbl_announcement_files
      )::int as attachments,
      (
        SELECT COALESCE(SUM(file_size),0)
        FROM tbl_announcement_files
      )::bigint AS storage_used
    FROM tbl_announcements
    `);

  return result.rows[0];
}

export async function getAnnouncemetCategorySummaryService() {
  const result = await ticketPool.query(`
    SELECT
      category,
      COUNT(*)::int AS total
    FROM tbl_announcements
    GROUP BY category
    ORDER BY total DESC,category ASC
    `);

  return result.rows;
}

export async function getRecentAnnouncementsService(limit = 5) {
  const result = await ticketPool.query(
    `
    SELECT
      a.announcement_id,
      a.title,
      a.category,
      u.d_name AS posted_by,
      a.publish_date,
      a.is_published,
      a.is_pinned
    FROM tbl_announcements a
    LEFT JOIN "tbl_userAccounts" u
      ON a.posted_by = u.user_id
    ORDER BY
      a.created_at DESC
    LIMIT $1
    `,
    [limit],
  );

  return result.rows;
}
//ADMIN
export async function getAnnouncementsService(queryParams) {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    status,
    sortBy = "created_at",
    sortOrder = "DESC",
  } = queryParams;

  const conditions = [];
  const values = [];

  let query = `
    SELECT
      a.announcement_id,
      a.title,
      a.category,
      a.content,
      u.d_name AS posted_name,
      a.is_published,
      a.is_pinned,
      a.publish_date,
      TO_CHAR(a.expiry_date, 'YYYY-MM-DD') as expiry_date,
      a.created_at,

      COUNT(f.file_id) AS attachment_count,
      COUNT(*) OVER() AS total_rows

    FROM tbl_announcements a

    LEFT JOIN "tbl_userAccounts" u
      ON a.posted_by = u.user_id

    LEFT JOIN tbl_announcement_files f
      ON a.announcement_id = f.announcement_id
  `;

  //SEARCH
  if (search) {
    values.push(`%${search}%`);

    conditions.push(
      `(a.title ILIKE $${values.length}) OR a.content ILIKE $${values.length}`,
    );
  }

  //CATEGORY
  if (category) {
    values.push(category);

    conditions.push(`a.category = $${values.length}`);
  }

  //STATUS
  if (status === "Published") {
    conditions.push(`a.is_published = TRUE`);
  }

  if (status === "Draft") {
    conditions.push(`a.is_published = FALSE`);
  }

  if (status === "Expired") {
    conditions.push(`CURRENT_DATE > a.expiry_date`);
  }

  if (conditions.length) {
    query += `WHERE ${conditions.join(" AND ")}`;
  }

  // GROUP BY
  query += `
    GROUP BY
      a.announcement_id,
      a.title,
      a.category,
      u.d_name,
      a.is_published,
      a.is_pinned,
      a.publish_date,
      a.expiry_date,
      a.created_at
  `;

  const allowedSort = {
    created_at: "a.created_at",
    title: "a.title",
    category: "a.category",
    publish_date: "a.publish_date",
  };

  const sortColumn = allowedSort[sortBy] ?? "a.created_at";
  const direction = sortOrder === "ASC" ? "ASC" : "DESC";

  query += `
    ORDER BY ${sortColumn} ${direction}
  `;

  // PAGINATION
  const offset = (Number(page) - 1) * Number(limit);

  values.push(Number(limit));

  query += `
    LIMIT $${values.length}
  `;

  values.push(offset);

  query += `
    OFFSET $${values.length}
  `;

  const result = await ticketPool.query(query, values);
  // PAGINATION RESULT
  const total = result.rows.length > 0 ? Number(result.rows[0].total_rows) : 0;

  return {
    announcements: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

export async function fetchAnnouncementById(id) {}

export async function insertAnnouncement({ body, files }) {
  const {
    title,
    category,
    content,
    postedBy,
    isPublished,
    isPinned,
    expiryDate,
  } = body;

  const client = await ticketPool.connect();
  try {
    await client.query("BEGIN");
    //insert announcement
    const announcementResult = await client.query(
      `
        INSERT INTO tbl_announcements(
            title,
            category,
            content,
            posted_by,
            is_published,
            is_pinned,
            expiry_date
        )
        VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING announcement_id
        `,
      [
        title,
        category,
        content,
        postedBy,
        isPublished,
        isPinned,
        expiryDate || null,
      ],
    );

    //get announcement_id
    const announcementId = announcementResult.rows[0].announcement_id;

    // Validate the uploaded file collection
    //Save uploaded files
    if (Array.isArray(files)) {
      for (const file of files) {
        if (!file.buffer || !file.originalname || !file.mimetype) {
          throw new Error("Invalid uploaded file.");
        }
        await client.query(
          `
            INSERT INTO tbl_announcement_files(
                announcement_id,
                display_name,
                original_filename,
                file_type,
                file_size,
                file_data
            ) VALUES($1,$2,$3,$4,$5,$6)
            `,
          [
            announcementId,
            file.originalname,
            file.originalname,
            file.mimetype,
            file.size,
            file.buffer,
          ],
        );
      }
    }
    await client.query("COMMIT");

    return {
      announcementId,
      filesUploaded: files.length,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateAnnouncementService({
  announcementId,
  body,
  files,
}) {
  const client = await ticketPool.connect();

  try {
    await client.query("BEGIN");

    const {
      title,
      category,
      content,
      postedBy,
      isPublished,
      isPinned,
      expiryDate,
    } = body;

    await client.query(
      `
      UPDATE tbl_announcements
      SET
        title=$1,
        category=$2,
        content=$3,
        posted_by=$4,
        is_published=$5,
        is_pinned=$6,
        expiry_date=$7,
        update_at=NOW()
      WHERE announcement_id=$8
      `,
      [
        title,
        category,
        content,
        postedBy,
        isPublished,
        isPinned,
        expiryDate || null,
        announcementId,
      ],
    );

    if (files.length) {
      await client.query(
        `
        DELETE
        FROM tbl_announcement_files
        WHERE announcement_id=$1
        `,
        [announcementId],
      );

      for (const file of files) {
        if (!file.buffer || !file.originalname || !file.mimetype) {
          throw new Error("Invalid uploaded file");
        }

        await client.query(
          `
          INSERT INTO tbl_announcement_files(
            announcement_id,
            display_name,
            original_filename,
            file_type,
            file_size,
            file_data
          )
          VALUES($1,$2,$3,$4,$5,$6)
          `,
          [
            announcementId,
            file.originalname,
            file.originalname,
            file.mimetype,
            file.size,
            file.buffer,
          ],
        );
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteAnnouncementService(announcementId) {
  const client = await ticketPool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `DELETE FROM tbl_announcement_files WHERE announcement_id=$1`,
      [announcementId],
    );

    const result = await client.query(
      `DELETE FROM tbl_announcements WHERE announcement_id=$1`,
      [announcementId],
    );

    if (!result.rowCount) {
      throw new Error("Announcement not found");
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    throw err;
  } finally {
    client.release();
  }
}

export async function toggleAnnouncementPublishService(announcementId) {
  const result = await ticketPool.query(
    `
      UPDATE tbl_announcements
      SET
        is_published = NOT is_published,
        publish_date=
          CASE
            WHEN NOT is_published
            THEN NOW()
            ELSE NULL
          END,
        update_at = NOW()
      WHERE announcement_id=$1
      RETURNING is_published
      `,
    [announcementId],
  );

  if (!result.rowCount) {
    throw new Error("Announcement not found");
  }

  return result.rows[0];
}

export async function toggleAnnouncementPinService(announcementId) {
  const result = await ticketPool.query(
    `
    UPDATE tbl_announcements
    SET
      is_pinned = NOT is_pinned,
      update_at = NOW()
    WHERE announcement_id = $1
    RETURNING is_pinned
    `,
    [announcementId],
  );

  if (!result.rowCount) {
    throw new Error("Announcement not found.");
  }

  return result.rows[0];
}
