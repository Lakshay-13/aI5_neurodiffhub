-- migrate:up
CREATE TYPE user_account_type AS ENUM (
    'hub',
    'admin'
);
CREATE TYPE acl_permission_type AS ENUM (
    'read',
    'readwrite',
    'owner'
);
CREATE TYPE hub_status_type AS ENUM (
    'created',
    'submitted',
    'rejected',
    'published'
);
CREATE TYPE diff_equation_type AS ENUM (
    'ode',
    'pde'
);
CREATE TYPE condition_type AS ENUM (
    'ivp',
    'ibvp1d',
    'dirichletbvp',
    'dirichletbvp2d'
);
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT,
    full_name TEXT,
    hashed_password TEXT,
    account_type user_account_type NOT NULL DEFAULT 'hub',
    github_username TEXT,
    twitter_handle TEXT,
    research_interests TEXT,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    updated_at BIGINT
);
CREATE UNIQUE INDEX users_username_index ON users (username);
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    orgname TEXT NOT NULL,
    full_name TEXT,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE organizations_users (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE UNIQUE INDEX organizations_users_organization_and_user ON organizations_users (organization_id, user_id);
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    projectname TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE projects_users (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
    permission_type acl_permission_type NOT NULL,
    is_default BOOLEAN NOT NULL,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE UNIQUE INDEX projects_users_project_and_user ON projects_users (project_id, user_id);
CREATE TABLE users_api_keys (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
    key TEXT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE use_cases (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE equations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE solutions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    variable_summary TEXT,
    usecase_summary TEXT,
    reference_summary TEXT,
    training_summary TEXT,
    other_summary TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    project_id BIGINT NOT NULL REFERENCES projects,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    hub_status hub_status_type NOT NULL DEFAULT 'created',
    like_count INTEGER NOT NULL DEFAULT 0,
    favorite_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    diff_equation_details JSONB,
    equation_type diff_equation_type NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    equation_id BIGINT REFERENCES equations,
    domain_t_min NUMERIC, 
    domain_t_max NUMERIC,
    domain_x_min NUMERIC,
    domain_x_max NUMERIC,
    domain_y_min NUMERIC,
    domain_y_max NUMERIC,
    equation_details JSONB,
    citation TEXT,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE solutions_conditions (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    version INTEGER NOT NULL,
    condition_type condition_type NOT NULL,
    ith_unit NUMERIC,
    t_0 NUMERIC,
    u_0 NUMERIC,
    u_0_prime NUMERIC,
    t_1 NUMERIC,
    u_1 NUMERIC,
    x0 NUMERIC,
    f0 TEXT,
    x1 NUMERIC,
    f1 TEXT,
    y0 NUMERIC,
    g0 TEXT,
    y1 NUMERIC,
    g1 TEXT,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE TABLE solutions_versions (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    version INTEGER NOT NULL,
    diff_equation_details JSONB,
    equation_type diff_equation_type NOT NULL,
    equation_id BIGINT REFERENCES equations,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE UNIQUE INDEX solutions_versions_solution_and_version ON solutions_versions (solution_id, version);
CREATE FUNCTION insert_solutions_versions()
RETURNS trigger AS $$
    BEGIN
        IF NEW.version != OLD.version THEN
            INSERT INTO solutions_versions (solution_id,name,description,version,diff_equation_details,equation_type,equation_id,created_at,created_by,updated_at,updated_by) 
            VALUES (OLD.id,
            OLD.name,OLD.description,OLD.version,OLD.diff_equation_details,OLD.equation_type,OLD.equation_id,
            OLD.created_at,OLD.created_by,OLD.updated_at,OLD.updated_by);
        END IF;
        RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_solutions
    AFTER UPDATE ON solutions
    FOR EACH ROW
    EXECUTE PROCEDURE insert_solutions_versions();

CREATE TABLE solutions_hub_status_history (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    hub_status hub_status_type NOT NULL,
    comments TEXT,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE INDEX solutions_hub_status_history_solution_id ON solutions_hub_status_history (solution_id);
CREATE TABLE solutions_api_keys (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    key TEXT NOT NULL,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE INDEX solutions_api_keys_solution_id ON solutions_api_keys (solution_id);
CREATE TABLE solutions_tags (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags ON DELETE CASCADE,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE INDEX solutions_tags_solution_id ON solutions_tags (solution_id);
CREATE INDEX solutions_tags_tag_id ON solutions_tags (tag_id);
CREATE UNIQUE INDEX solutions_tags_solution_and_tag ON solutions_tags (solution_id, tag_id);
CREATE TABLE solutions_use_cases (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    use_case_id BIGINT NOT NULL REFERENCES use_cases ON DELETE CASCADE,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE INDEX solutions_use_cases_solution_id ON solutions_use_cases (solution_id);
CREATE INDEX solutions_use_cases_use_case_id ON solutions_use_cases (use_case_id);
CREATE UNIQUE INDEX solutions_use_cases_solution_and_use_case ON solutions_use_cases (solution_id, use_case_id);
CREATE TABLE solutions_favorites (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE INDEX solutions_favorites_solution_id ON solutions_favorites (solution_id);
CREATE INDEX solutions_favorites_user_id ON solutions_favorites (user_id);
CREATE UNIQUE INDEX solutions_favorites_solution_and_user ON solutions_favorites (solution_id, user_id);
CREATE TABLE solutions_likes (
    id BIGSERIAL PRIMARY KEY,
    solution_id BIGINT NOT NULL REFERENCES solutions ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM clock_timestamp()) * 1000,
    created_by BIGINT REFERENCES users ON DELETE SET NULL,
    updated_at BIGINT,
    updated_by BIGINT REFERENCES users ON DELETE SET NULL
);
CREATE INDEX solutions_likes_solution_id ON solutions_likes (solution_id);
CREATE INDEX solutions_likes_user_id ON solutions_likes (user_id);
CREATE UNIQUE INDEX solutions_likes_solution_and_user ON solutions_likes (solution_id, user_id);

-- migrate:down
DROP TABLE IF EXISTS solutions_likes;
DROP TABLE IF EXISTS solutions_favorites;
DROP TABLE IF EXISTS solutions_use_cases;
DROP TABLE IF EXISTS solutions_tags;
DROP TABLE IF EXISTS solutions_api_keys;
DROP TABLE IF EXISTS solutions_hub_status_history;
DROP TABLE IF EXISTS solutions_versions;
DROP TABLE IF EXISTS solutions_conditions;
DROP TABLE IF EXISTS solutions;
DROP TABLE IF EXISTS equations;
DROP TABLE IF EXISTS use_cases;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users_api_keys;
DROP TABLE IF EXISTS projects_users;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations_users;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS users;
DROP FUNCTION IF EXISTS insert_solutions_versions;
DROP TYPE IF EXISTS acl_permission_type;
DROP TYPE IF EXISTS user_account_type;
DROP TYPE IF EXISTS hub_status_type;
DROP TYPE IF EXISTS diff_equation_type;
DROP TYPE IF EXISTS condition_type;
