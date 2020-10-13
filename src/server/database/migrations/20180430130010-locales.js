"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      CREATE TABLE IF NOT EXISTS locales (
        id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name TEXT CHARACTER SET utf8 NOT NULL
      );
      
      INSERT INTO locales (id, name) VALUES (1, 'en');
      
      ALTER TABLE sentences ADD COLUMN locale_id SMALLINT NOT NULL DEFAULT 1;
      
      ALTER TABLE clips ADD COLUMN locale_id SMALLINT NOT NULL DEFAULT 1;
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180430130010-locales.js.map