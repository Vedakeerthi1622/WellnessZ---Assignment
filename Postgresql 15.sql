-- Database: NewDB

-- DROP DATABASE IF EXISTS "NewDB";

CREATE DATABASE "NewDB"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	
	
	
create table persons
(
personid int,
	fullname varchar(255)
)