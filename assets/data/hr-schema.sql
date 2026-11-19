CREATE TABLE regions(region_id INTEGER PRIMARY KEY, region_name TEXT);
CREATE TABLE countries(country_id TEXT PRIMARY KEY, country_name TEXT, region_id INTEGER);
CREATE TABLE locations(location_id INTEGER PRIMARY KEY, street_address TEXT, postal_code TEXT, city TEXT, state_province TEXT, country_id TEXT);
CREATE TABLE jobs(job_id TEXT PRIMARY KEY, job_title TEXT, min_salary INTEGER, max_salary INTEGER);
CREATE TABLE departments(department_id INTEGER PRIMARY KEY, department_name TEXT, manager_id INTEGER, location_id INTEGER);
CREATE TABLE employees(employee_id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, phone_number TEXT, hire_date TEXT, job_id TEXT, salary REAL, commission_pct REAL, manager_id INTEGER, department_id INTEGER);
CREATE TABLE job_history(employee_id INTEGER, start_date TEXT, end_date TEXT, job_id TEXT, department_id INTEGER, PRIMARY KEY(employee_id,start_date));
CREATE TABLE dual(dummy TEXT);
INSERT INTO dual VALUES('X');
