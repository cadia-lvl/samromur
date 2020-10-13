"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = async function (db) {
    return db.runSql(`
      CREATE TABLE requested_languages (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        language TEXT CHARACTER SET utf8 NOT NULL,
        UNIQUE(language(200))
      );
      
      CREATE TABLE language_requests (
        requested_languages_id BIGINT(20) UNSIGNED NOT NULL,
        client_id CHAR(36) NOT NULL,
        PRIMARY KEY (requested_languages_id, client_id)
      );
    `);
};
exports.down = function () {
    return null;
};
//# sourceMappingURL=20180309110854-add-requested-languages.js.map