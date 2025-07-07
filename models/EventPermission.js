import mongoose from 'mongoose';

const pengisiEventSchema = new mongoose.Schema({
  nama_pengisi: { type: String, required: true },
  judul_materi: { type: String, required: true },
}, { _id: false });

const eventPermissionSchema = new mongoose.Schema({
  nama_acara: { type: String, required: true },
  penyelenggara: { type: String, required: true },
  jumlah_peserta: { type: Number, required: true, min: 1 },
  tanggal_mulai: { type: String, required: true },
  tanggal_selesai: { type: String, required: true },
  jam_mulai: String,
  jam_selesai: String,
  lokasi: { type: String, required: true, minlength: 10 },
  provinsi_id: Number,
  kota_id: Number,
  kategori_acara_id: Number,
  biaya: String,
  deskripsi: String,
  dokumentasi_url: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verified_at: Date,
  verified_by: String,
  pengisi_event: [pengisiEventSchema]
}, { timestamps: true });

export default mongoose.model('EventPermission', eventPermissionSchema);
