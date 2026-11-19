-- DADES DE DEMOSTRACIÓ (subconjunt de HR). Substitueix aquest fitxer per l'export complet d'SQL Developer (només INSERTs).
INSERT INTO regions VALUES (1,'Europe'),(2,'Americas');
INSERT INTO countries VALUES ('US','United States of America',2),('CA','Canada',2),('UK','United Kingdom',1);
INSERT INTO locations VALUES (1400,'2014 Jabberwocky Rd','26192','Southlake','Texas','US'),(1500,'2011 Interiors Blvd','99236','South San Francisco','California','US'),(1700,'2004 Charade Rd','98199','Seattle','Washington','US'),(1800,'147 Spadina Ave','M5V 2L7','Toronto','Ontario','CA'),(2500,'Magdalen Centre','OX9 9ZB','Oxford','Oxford','UK');
INSERT INTO jobs VALUES ('AD_PRES','President',20080,40000),('AD_VP','Administration Vice President',15000,30000),('AD_ASST','Administration Assistant',3000,6000),('MK_MAN','Marketing Manager',9000,15000),('MK_REP','Marketing Representative',4000,9000),('SA_MAN','Sales Manager',10000,20080),('SA_REP','Sales Representative',6000,12008),('ST_MAN','Stock Manager',5500,8500),('ST_CLERK','Stock Clerk',2008,5000),('IT_PROG','Programmer',4000,10000);
INSERT INTO departments VALUES (10,'Administration',200,1700),(20,'Marketing',201,1800),(50,'Shipping',124,1500),(60,'IT',103,1400),(80,'Sales',149,2500),(90,'Executive',100,1700),(190,'Contracting',NULL,1700);
INSERT INTO employees VALUES
(100,'Steven','King','SKING',NULL,'2003-06-17','AD_PRES',24000,NULL,NULL,90),
(101,'Neena','Kochhar','NKOCHHAR',NULL,'2005-09-21','AD_VP',17000,NULL,100,90),
(102,'Lex','De Haan','LDEHAAN',NULL,'2001-01-13','AD_VP',17000,NULL,100,90),
(103,'Alexander','Hunold','AHUNOLD',NULL,'2006-01-03','IT_PROG',9000,NULL,102,60),
(104,'Bruce','Ernst','BERNST',NULL,'2007-05-21','IT_PROG',6000,NULL,103,60),
(105,'David','Austin','DAUSTIN',NULL,'2005-06-25','IT_PROG',4800,NULL,103,60),
(106,'Valli','Pataballa','VPATABAL',NULL,'2006-02-05','IT_PROG',4800,NULL,103,60),
(107,'Diana','Lorentz','DLORENTZ',NULL,'2007-02-07','IT_PROG',4200,NULL,103,60),
(124,'Kevin','Mourgos','KMOURGOS',NULL,'2007-11-16','ST_MAN',5800,NULL,100,50),
(141,'Trenna','Rajs','TRAJS',NULL,'2003-10-17','ST_CLERK',3500,NULL,124,50),
(142,'Curtis','Davies','CDAVIES',NULL,'2005-01-29','ST_CLERK',3100,NULL,124,50),
(143,'Randall','Matos','RMATOS',NULL,'2006-03-15','ST_CLERK',2600,NULL,124,50),
(149,'Eleni','Zlotkey','EZLOTKEY',NULL,'2008-01-29','SA_MAN',10500,0.2,100,80),
(176,'Jonathon','Taylor','JTAYLOR',NULL,'2006-03-24','SA_REP',8600,0.2,149,80),
(178,'Kimberely','Grant','KGRANT',NULL,'2007-05-24','SA_REP',7000,0.15,149,NULL),
(200,'Jennifer','Whalen','JWHALEN',NULL,'2003-09-17','AD_ASST',4400,NULL,101,10),
(201,'Michael','Hartstein','MHARTSTE',NULL,'2004-02-17','MK_MAN',13000,NULL,100,20),
(202,'Pat','Fay','PFAY',NULL,'2005-08-17','MK_REP',6000,NULL,201,20);
