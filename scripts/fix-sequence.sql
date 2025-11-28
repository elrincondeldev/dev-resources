SELECT setval('resources_id_seq', (SELECT MAX(CAST(id AS INTEGER)) FROM resources) + 1);

SELECT currval('resources_id_seq');
