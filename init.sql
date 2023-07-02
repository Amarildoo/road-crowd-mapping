-- create user table
create table "user"
(
    id       serial primary key,
    username varchar not null unique,
    password varchar not null,
    role     TEXT CHECK (role IN ('user', 'admin'))
);

-- create observation table
create table observation
(
    id          serial primary key not null,
    created_by  integer not null constraint observation__user_fk references "user"(id),
    description text not null,
    status      integer not null CHECK (status IN (1, 2, 3)),
    created_at  timestamp not null,
    gps_lat     float not null,
    gps_long    float not null,
    type        integer not null CHECK (type IN (1, 2, 3)),
    action_at   timestamp
);

-- insert default user with username 'admin' and password 'adminadmin'
insert into "user" (username, password, role)
values ('admin', '$2b$10$e29CZuprWl0l.F9n.gu7h.8/YYxkX9q8q/1K9oL8F6/MBfLs80xXW', 'admin');
