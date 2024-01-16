SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: acl_permission_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.acl_permission_type AS ENUM (
    'read',
    'readwrite',
    'owner'
);


--
-- Name: condition_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.condition_type AS ENUM (
    'ivp',
    'ibvp1d',
    'dirichletbvp',
    'dirichletbvp2d'
);


--
-- Name: diff_equation_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.diff_equation_type AS ENUM (
    'ode',
    'pde'
);


--
-- Name: hub_status_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hub_status_type AS ENUM (
    'created',
    'submitted',
    'rejected',
    'published'
);


--
-- Name: user_account_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_account_type AS ENUM (
    'hub',
    'admin'
);


--
-- Name: insert_solutions_versions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.insert_solutions_versions() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF NEW.version != OLD.version THEN
            INSERT INTO solutions_versions (solution_id,name,description,version,diff_equation_details,equation_type,equation_id,created_at,created_by,updated_at,updated_by)
            VALUES (OLD.id,
            OLD.name,OLD.description,OLD.version,OLD.diff_equation_details,OLD.equation_type,OLD.equation_id,
            OLD.created_at,OLD.created_by,OLD.updated_at,OLD.updated_by);
        END IF;
        RETURN NULL;
    END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: equations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.equations (
    id bigint NOT NULL,
    name text NOT NULL,
    description text,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: equations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.equations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: equations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.equations_id_seq OWNED BY public.equations.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    id bigint NOT NULL,
    orgname text NOT NULL,
    full_name text,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: organizations_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations_users (
    id bigint NOT NULL,
    organization_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: organizations_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizations_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizations_users_id_seq OWNED BY public.organizations_users.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id bigint NOT NULL,
    projectname text NOT NULL,
    description text,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: projects_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects_users (
    id bigint NOT NULL,
    project_id bigint NOT NULL,
    user_id bigint NOT NULL,
    permission_type public.acl_permission_type NOT NULL,
    is_default boolean NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: projects_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_users_id_seq OWNED BY public.projects_users.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions (
    id bigint NOT NULL,
    name text NOT NULL,
    description text,
    version integer DEFAULT 1 NOT NULL,
    project_id bigint NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    hub_status public.hub_status_type DEFAULT 'created'::public.hub_status_type NOT NULL,
    like_count integer DEFAULT 0 NOT NULL,
    favorite_count integer DEFAULT 0 NOT NULL,
    download_count integer DEFAULT 0 NOT NULL,
    diff_equation_details jsonb,
    equation_type public.diff_equation_type NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    equation_id bigint,
    domain_t_min numeric,
    domain_t_max numeric,
    domain_x_min numeric,
    domain_x_max numeric,
    domain_y_min numeric,
    domain_y_max numeric,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_api_keys (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    key text NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_api_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_api_keys_id_seq OWNED BY public.solutions_api_keys.id;


--
-- Name: solutions_conditions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_conditions (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    version integer NOT NULL,
    condition_type public.condition_type NOT NULL,
    ith_unit numeric,
    t_0 numeric,
    u_0 numeric,
    u_0_prime numeric,
    t_1 numeric,
    u_1 numeric,
    x0 numeric,
    f0 text,
    x1 numeric,
    f1 text,
    y0 numeric,
    g0 text,
    y1 numeric,
    g1 text,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_conditions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_conditions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_conditions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_conditions_id_seq OWNED BY public.solutions_conditions.id;


--
-- Name: solutions_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_favorites (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_favorites_id_seq OWNED BY public.solutions_favorites.id;


--
-- Name: solutions_hub_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_hub_status_history (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    hub_status public.hub_status_type NOT NULL,
    comments text,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_hub_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_hub_status_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_hub_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_hub_status_history_id_seq OWNED BY public.solutions_hub_status_history.id;


--
-- Name: solutions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_id_seq OWNED BY public.solutions.id;


--
-- Name: solutions_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_likes (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_likes_id_seq OWNED BY public.solutions_likes.id;


--
-- Name: solutions_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_tags (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    tag_id bigint NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_tags_id_seq OWNED BY public.solutions_tags.id;


--
-- Name: solutions_use_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_use_cases (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    use_case_id bigint NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_use_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_use_cases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_use_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_use_cases_id_seq OWNED BY public.solutions_use_cases.id;


--
-- Name: solutions_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions_versions (
    id bigint NOT NULL,
    solution_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    version integer NOT NULL,
    diff_equation_details jsonb,
    equation_type public.diff_equation_type NOT NULL,
    equation_id bigint,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: solutions_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solutions_versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solutions_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solutions_versions_id_seq OWNED BY public.solutions_versions.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    name text NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: use_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.use_cases (
    id bigint NOT NULL,
    name text NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: use_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.use_cases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: use_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.use_cases_id_seq OWNED BY public.use_cases.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username text NOT NULL,
    email text,
    full_name text,
    hashed_password text,
    account_type public.user_account_type DEFAULT 'hub'::public.user_account_type NOT NULL,
    github_username text,
    twitter_handle text,
    research_interests text,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    updated_at bigint
);


--
-- Name: users_api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_api_keys (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    key text NOT NULL,
    created_at bigint DEFAULT (date_part('epoch'::text, clock_timestamp()) * (1000)::double precision) NOT NULL,
    created_by bigint,
    updated_at bigint,
    updated_by bigint
);


--
-- Name: users_api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_api_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_api_keys_id_seq OWNED BY public.users_api_keys.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: equations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equations ALTER COLUMN id SET DEFAULT nextval('public.equations_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: organizations_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations_users ALTER COLUMN id SET DEFAULT nextval('public.organizations_users_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: projects_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects_users ALTER COLUMN id SET DEFAULT nextval('public.projects_users_id_seq'::regclass);


--
-- Name: solutions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions ALTER COLUMN id SET DEFAULT nextval('public.solutions_id_seq'::regclass);


--
-- Name: solutions_api_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_api_keys ALTER COLUMN id SET DEFAULT nextval('public.solutions_api_keys_id_seq'::regclass);


--
-- Name: solutions_conditions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_conditions ALTER COLUMN id SET DEFAULT nextval('public.solutions_conditions_id_seq'::regclass);


--
-- Name: solutions_favorites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_favorites ALTER COLUMN id SET DEFAULT nextval('public.solutions_favorites_id_seq'::regclass);


--
-- Name: solutions_hub_status_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_hub_status_history ALTER COLUMN id SET DEFAULT nextval('public.solutions_hub_status_history_id_seq'::regclass);


--
-- Name: solutions_likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_likes ALTER COLUMN id SET DEFAULT nextval('public.solutions_likes_id_seq'::regclass);


--
-- Name: solutions_tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_tags ALTER COLUMN id SET DEFAULT nextval('public.solutions_tags_id_seq'::regclass);


--
-- Name: solutions_use_cases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_use_cases ALTER COLUMN id SET DEFAULT nextval('public.solutions_use_cases_id_seq'::regclass);


--
-- Name: solutions_versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_versions ALTER COLUMN id SET DEFAULT nextval('public.solutions_versions_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: use_cases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.use_cases ALTER COLUMN id SET DEFAULT nextval('public.use_cases_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_api_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_api_keys ALTER COLUMN id SET DEFAULT nextval('public.users_api_keys_id_seq'::regclass);


--
-- Name: equations equations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equations
    ADD CONSTRAINT equations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations_users organizations_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations_users
    ADD CONSTRAINT organizations_users_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects_users projects_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects_users
    ADD CONSTRAINT projects_users_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: solutions_api_keys solutions_api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_api_keys
    ADD CONSTRAINT solutions_api_keys_pkey PRIMARY KEY (id);


--
-- Name: solutions_conditions solutions_conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_conditions
    ADD CONSTRAINT solutions_conditions_pkey PRIMARY KEY (id);


--
-- Name: solutions_favorites solutions_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_favorites
    ADD CONSTRAINT solutions_favorites_pkey PRIMARY KEY (id);


--
-- Name: solutions_hub_status_history solutions_hub_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_hub_status_history
    ADD CONSTRAINT solutions_hub_status_history_pkey PRIMARY KEY (id);


--
-- Name: solutions_likes solutions_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_likes
    ADD CONSTRAINT solutions_likes_pkey PRIMARY KEY (id);


--
-- Name: solutions solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_pkey PRIMARY KEY (id);


--
-- Name: solutions_tags solutions_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_tags
    ADD CONSTRAINT solutions_tags_pkey PRIMARY KEY (id);


--
-- Name: solutions_use_cases solutions_use_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_use_cases
    ADD CONSTRAINT solutions_use_cases_pkey PRIMARY KEY (id);


--
-- Name: solutions_versions solutions_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_versions
    ADD CONSTRAINT solutions_versions_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: use_cases use_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.use_cases
    ADD CONSTRAINT use_cases_pkey PRIMARY KEY (id);


--
-- Name: users_api_keys users_api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_api_keys
    ADD CONSTRAINT users_api_keys_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: organizations_users_organization_and_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX organizations_users_organization_and_user ON public.organizations_users USING btree (organization_id, user_id);


--
-- Name: projects_users_project_and_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX projects_users_project_and_user ON public.projects_users USING btree (project_id, user_id);


--
-- Name: solutions_api_keys_solution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_api_keys_solution_id ON public.solutions_api_keys USING btree (solution_id);


--
-- Name: solutions_favorites_solution_and_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX solutions_favorites_solution_and_user ON public.solutions_favorites USING btree (solution_id, user_id);


--
-- Name: solutions_favorites_solution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_favorites_solution_id ON public.solutions_favorites USING btree (solution_id);


--
-- Name: solutions_favorites_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_favorites_user_id ON public.solutions_favorites USING btree (user_id);


--
-- Name: solutions_hub_status_history_solution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_hub_status_history_solution_id ON public.solutions_hub_status_history USING btree (solution_id);


--
-- Name: solutions_likes_solution_and_user; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX solutions_likes_solution_and_user ON public.solutions_likes USING btree (solution_id, user_id);


--
-- Name: solutions_likes_solution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_likes_solution_id ON public.solutions_likes USING btree (solution_id);


--
-- Name: solutions_likes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_likes_user_id ON public.solutions_likes USING btree (user_id);


--
-- Name: solutions_tags_solution_and_tag; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX solutions_tags_solution_and_tag ON public.solutions_tags USING btree (solution_id, tag_id);


--
-- Name: solutions_tags_solution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_tags_solution_id ON public.solutions_tags USING btree (solution_id);


--
-- Name: solutions_tags_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_tags_tag_id ON public.solutions_tags USING btree (tag_id);


--
-- Name: solutions_use_cases_solution_and_use_case; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX solutions_use_cases_solution_and_use_case ON public.solutions_use_cases USING btree (solution_id, use_case_id);


--
-- Name: solutions_use_cases_solution_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_use_cases_solution_id ON public.solutions_use_cases USING btree (solution_id);


--
-- Name: solutions_use_cases_use_case_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_use_cases_use_case_id ON public.solutions_use_cases USING btree (use_case_id);


--
-- Name: solutions_versions_solution_and_version; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX solutions_versions_solution_and_version ON public.solutions_versions USING btree (solution_id, version);


--
-- Name: users_username_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_index ON public.users USING btree (username);


--
-- Name: solutions update_solutions; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_solutions AFTER UPDATE ON public.solutions FOR EACH ROW EXECUTE FUNCTION public.insert_solutions_versions();


--
-- Name: equations equations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equations
    ADD CONSTRAINT equations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: equations equations_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equations
    ADD CONSTRAINT equations_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: organizations organizations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: organizations organizations_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: organizations_users organizations_users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations_users
    ADD CONSTRAINT organizations_users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: organizations_users organizations_users_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations_users
    ADD CONSTRAINT organizations_users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
-- Name: organizations_users organizations_users_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations_users
    ADD CONSTRAINT organizations_users_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: organizations_users organizations_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations_users
    ADD CONSTRAINT organizations_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: projects projects_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: projects_users projects_users_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects_users
    ADD CONSTRAINT projects_users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: projects_users projects_users_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects_users
    ADD CONSTRAINT projects_users_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects_users projects_users_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects_users
    ADD CONSTRAINT projects_users_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: projects_users projects_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects_users
    ADD CONSTRAINT projects_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: solutions_api_keys solutions_api_keys_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_api_keys
    ADD CONSTRAINT solutions_api_keys_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_api_keys solutions_api_keys_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_api_keys
    ADD CONSTRAINT solutions_api_keys_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_api_keys solutions_api_keys_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_api_keys
    ADD CONSTRAINT solutions_api_keys_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_conditions solutions_conditions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_conditions
    ADD CONSTRAINT solutions_conditions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_conditions solutions_conditions_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_conditions
    ADD CONSTRAINT solutions_conditions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_conditions solutions_conditions_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_conditions
    ADD CONSTRAINT solutions_conditions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions solutions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions solutions_equation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_equation_id_fkey FOREIGN KEY (equation_id) REFERENCES public.equations(id);


--
-- Name: solutions_favorites solutions_favorites_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_favorites
    ADD CONSTRAINT solutions_favorites_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_favorites solutions_favorites_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_favorites
    ADD CONSTRAINT solutions_favorites_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_favorites solutions_favorites_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_favorites
    ADD CONSTRAINT solutions_favorites_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_favorites solutions_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_favorites
    ADD CONSTRAINT solutions_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: solutions_hub_status_history solutions_hub_status_history_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_hub_status_history
    ADD CONSTRAINT solutions_hub_status_history_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_hub_status_history solutions_hub_status_history_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_hub_status_history
    ADD CONSTRAINT solutions_hub_status_history_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_hub_status_history solutions_hub_status_history_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_hub_status_history
    ADD CONSTRAINT solutions_hub_status_history_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_likes solutions_likes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_likes
    ADD CONSTRAINT solutions_likes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_likes solutions_likes_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_likes
    ADD CONSTRAINT solutions_likes_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_likes solutions_likes_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_likes
    ADD CONSTRAINT solutions_likes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_likes solutions_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_likes
    ADD CONSTRAINT solutions_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: solutions solutions_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: solutions_tags solutions_tags_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_tags
    ADD CONSTRAINT solutions_tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_tags solutions_tags_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_tags
    ADD CONSTRAINT solutions_tags_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_tags solutions_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_tags
    ADD CONSTRAINT solutions_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: solutions_tags solutions_tags_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_tags
    ADD CONSTRAINT solutions_tags_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions solutions_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_use_cases solutions_use_cases_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_use_cases
    ADD CONSTRAINT solutions_use_cases_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_use_cases solutions_use_cases_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_use_cases
    ADD CONSTRAINT solutions_use_cases_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_use_cases solutions_use_cases_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_use_cases
    ADD CONSTRAINT solutions_use_cases_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_use_cases solutions_use_cases_use_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_use_cases
    ADD CONSTRAINT solutions_use_cases_use_case_id_fkey FOREIGN KEY (use_case_id) REFERENCES public.use_cases(id) ON DELETE CASCADE;


--
-- Name: solutions_versions solutions_versions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_versions
    ADD CONSTRAINT solutions_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: solutions_versions solutions_versions_equation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_versions
    ADD CONSTRAINT solutions_versions_equation_id_fkey FOREIGN KEY (equation_id) REFERENCES public.equations(id);


--
-- Name: solutions_versions solutions_versions_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_versions
    ADD CONSTRAINT solutions_versions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE;


--
-- Name: solutions_versions solutions_versions_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions_versions
    ADD CONSTRAINT solutions_versions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tags tags_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tags tags_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: use_cases use_cases_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.use_cases
    ADD CONSTRAINT use_cases_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: use_cases use_cases_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.use_cases
    ADD CONSTRAINT use_cases_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: users_api_keys users_api_keys_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_api_keys
    ADD CONSTRAINT users_api_keys_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: users_api_keys users_api_keys_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_api_keys
    ADD CONSTRAINT users_api_keys_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: users_api_keys users_api_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_api_keys
    ADD CONSTRAINT users_api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20210503121535'),
    ('20210610115244'),
    ('20210903183923');
