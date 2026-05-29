use abp;
create view Vista_Usuarios as
select id, nombre_usuario, password, email, is_admin from Usuarios;

select * from Vista_Usuarios;

CREATE VIEW vista_preguntas_respuestas AS
SELECT 
    c.nombre_cat AS categoria,
    p.letra AS letra_rosco,
    p.enunciado AS pregunta,
    r.texto_respuesta AS respuesta_posible,
    IF(r.correcta = 1, 'SÍ', 'NO') AS es_la_correcta
FROM preguntas p
JOIN categorias c ON p.id_cat = c.id_cat
JOIN respuestas r ON p.id_pregunta = r.id_pregunta;

select * from vista_preguntas_respuestas;