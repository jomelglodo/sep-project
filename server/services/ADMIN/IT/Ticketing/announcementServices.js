import { ticketPool } from "../../../../db.js";

export async function fetchAnnouncements() {}

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

export async function editAnnouncement(id, data) {}

export async function removeAnnouncement(id) {}
