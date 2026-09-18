const fs = require("fs/promises");
const path = require("path");
const { UPLOAD_DIR } = require("../middleware/upload");

/**
 * Shared tail end of an avatar upload: check the file arrived, point the record
 * at it, and clean up the file it replaced.
 *
 * `Model` needs a primary key and an `avatar` column. multer has already written
 * the file to disk by the time this runs, so every early return has to remove it
 * again or the upload folder fills with orphans.
 */
async function saveAvatar({ Model, id, file, res, label }) {
  // multer leaves req.file undefined when the field name does not match or the
  // filter rejected the file.
  if (!file) {
    return res
      .status(400)
      .json({ status: false, message: "No image was uploaded." });
  }

  // The URL path the browser will request -- not a filesystem path.
  const avatarPath = `/uploads/${file.filename}`;

  const record = await Model.findByPk(id);
  if (!record) {
    await fs.unlink(file.path).catch(() => {});
    return res
      .status(404)
      .json({ status: false, message: `${label} not found.` });
  }

  const oldAvatar = record.avatar;
  await record.update({ avatar: avatarPath });

  // Best-effort: the new avatar is already saved, so a failed cleanup must not
  // fail the request. Guarded to /uploads/ so seeded external URLs are untouched.
  if (oldAvatar && oldAvatar.startsWith("/uploads/")) {
    await fs
      .unlink(path.join(UPLOAD_DIR, path.basename(oldAvatar)))
      .catch(() => {});
  }

  return res.status(200).json({ status: true, avatar: avatarPath });
}

module.exports = saveAvatar;
