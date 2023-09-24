drop database if exists moviesdb;

create database moviesdb;

use moviesdb;

create table movies (
    id binary(16) primary key default (UUID_TO_BIN(UUID())),
    title varchar(255) not null,
    year int not null,
    director varchar(255) not null,
    duration int not null,
    poster text not null,
    genre varchar(255) not null,
    rate decimal(2, 1) unsigned not null
);

create table genres (
    id int auto_increment primary key,
    name varchar(255) not null unique
);

create table movies_genres (
    movie_id binary(16) references movie(id),
    genre_id int references genre(id),
    primary key (movie_id, genre_id)
);

insert into genres (name) values
('Drama'), ('Romance'), ('Crime'), ('Action'), ('Sci-Fi'), ('Adventure'), ('Animation'), ('Biography'), ('Fantasy');

insert into movies(title, year, director, duration, poster, rate) values
("Interestellar", 2014, "Christopher Nolan", 169, "https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg", 8.6),
("Inception", 2010, "Christopher Nolan", 148, "https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg", 8.8),
("Avatar", 2009, "James Cameron", 162, "https://i.etsystatic.com/35681979/r/il/dfe3ba/3957859451/il_fullxfull.3957859451_h27r.jpg", 7.8);

insert into movies_genres(movie_id, genre_id) values
((select id from movies where title="Interestellar"), (select id from genres where name = "Adventure")),
((select id from movies where title="Interestellar"), (select id from genres where name = "Drama")),
((select id from movies where title="Interestellar"), (select id from genres where name = "Sci-Fi")),
((select id from movies where title="Inception"), (select id from genres where name = "Adventure")),
((select id from movies where title="Inception"), (select id from genres where name = "Action")),
((select id from movies where title="Inception"), (select id from genres where name = "Sci-Fi")),
((select id from movies where title="Avatar"), (select id from genres where name = "Adventure")),
((select id from movies where title="Avatar"), (select id from genres where name = "Action")),
((select id from movies where title="Avatar"), (select id from genres where name = "Fantasy"));