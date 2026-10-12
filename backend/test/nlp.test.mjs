import test from "node:test";
import assert from "node:assert/strict";
import { analyzeQuestion, classifyIntent, extractEntities } from "../src/nlp.mjs";

test("intent classification scores Indonesian questions and exposes confidence", () => {
  assert.equal(classifyIntent("Kapan jadwal ujian sekolah?").intent, "academic_agenda");
  assert.equal(classifyIntent("Ada pengumuman terbaru?").intent, "announcement");
  assert.equal(classifyIntent("Berita prestasi siswa terbaru").intent, "news");
  assert.equal(classifyIntent("Jurusan RPL belajar apa?").intent, "academic_program");
  assert.equal(classifyIntent("Di mana alamat dan kontak sekolah?").intent, "school_profile");
  const unknown = classifyIntent("Halo");
  assert.deepEqual(unknown, { intent: "other", confidence: 0 });
  const { confidence } = classifyIntent("Jadwal agenda kegiatan kalender");
  assert.ok(confidence > 0 && confidence <= 1);
});

test("entity extraction finds weekdays, months, dates, programs and relative time", () => {
  const entities = extractEntities("Apakah TKJ ada ujian hari Jumat, 6 November 2026 atau minggu depan?");
  assert.deepEqual(entities.programs, ["tkj"]);
  assert.deepEqual(entities.weekdays, ["jumat"]);
  assert.deepEqual(entities.months, ["november"]);
  assert.deepEqual(entities.dates, ["6 november 2026"]);
  assert.deepEqual(entities.years, ["2026"]);
  assert.deepEqual(entities.relative, ["minggu depan"]);
  assert.deepEqual(extractEntities("Teknik Kendaraan Ringan itu apa").programs, ["tkr"]);
});

test("analyzeQuestion output is storable and never contains the raw question", () => {
  const question = "Kapan jadwal asesmen hari Jumat? Hubungi 0812-3456-7890";
  const result = analyzeQuestion(question, [{
    resource: "academic-agenda",
    slug: "asesmen-sekolah",
    title: "Jadwal Asesmen Sekolah",
    description: "Asesmen berlangsung pada hari Jumat di aula."
  }]);
  assert.equal(result.intent, "academic_agenda");
  assert.equal(result.nlp_version, "wilhel-nlp-1");
  assert.equal(result.matched_refs.length, 1);
  assert.equal(result.matched_refs[0].resource, "academic-agenda");
  assert.match(result.context, /Jadwal Asesmen Sekolah/);
  assert.ok(result.context.length <= 7_000);
  assert.equal(JSON.stringify(result).includes(question), false);
});

test("analyzeQuestion returns an empty context when nothing published matches", () => {
  const result = analyzeQuestion("Bagaimana cara mendaftar?", []);
  assert.equal(result.context, "");
  assert.deepEqual(result.matched_refs, []);
});
