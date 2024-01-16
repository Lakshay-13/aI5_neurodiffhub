-- migrate:up
INSERT INTO users(username,full_name,account_type,hashed_password) VALUES ('admin','Admin User','admin','$2b$12$vWxVSPzAzicnvlqBat.6nexCkmZNDLbzUnPDXN8eiY60q0INEa5j2');

INSERT INTO equations(name,description) VALUES ('Population Equation','');
INSERT INTO equations(name,description) VALUES ('Logistic Equation','');
INSERT INTO equations(name,description) VALUES ('Forced Harmonic Oscillator','');
INSERT INTO equations(name,description) VALUES ('Duffing Equation','');
INSERT INTO equations(name,description) VALUES ('Pendulum','');
INSERT INTO equations(name,description) VALUES ('Laplace’s Equation','');
INSERT INTO equations(name,description) VALUES ('Poisson Equation','');
INSERT INTO equations(name,description) VALUES ('Heat Equation','');
INSERT INTO equations(name,description) VALUES ('Wave Equation','');
INSERT INTO equations(name,description) VALUES ('Advection-Diffusion-Reaction Equation','');
INSERT INTO equations(name,description) VALUES ('Burger’s Equation','');
INSERT INTO equations(name,description) VALUES ('Lotka Volterra','');
INSERT INTO equations(name,description) VALUES ('Lorentz System','');
INSERT INTO equations(name,description) VALUES ('Maxwell’s','');
INSERT INTO equations(name,description) VALUES ('Backward Facing Step','');
INSERT INTO equations(name,description) VALUES ('SIR Model','');

INSERT INTO use_cases(name) VALUES ('Thermo');
INSERT INTO use_cases(name) VALUES ('Automobile');
INSERT INTO use_cases(name) VALUES ('Electrical Systems');
INSERT INTO use_cases(name) VALUES ('Fluid Dynamics');
INSERT INTO use_cases(name) VALUES ('Economics');

-- migrate:down
DELETE FROM users where username='admin';
DELETE FROM equations;


