# LYS Finder

Search your neighborhood for local yarn stores!

![search](/public/img/search-view.png)

## Design

![wireframes](/public/img/search-wireframe.png)
![wireframes](/public/img/store-view-wireframe.png)

I started with a general idea of what I wanted to create: a search page and a general information page for each page.

## Planning

### Models
![models](/public/img/models.png)

The next thing that I focused on was what sort of data I'd want to save and what would be better to call from the API I decided to use. Looking at the information I got back from the API, I didn't need to save a ton of that information to my databases; it would be better to leave things like addresses out and call the API when I needed them.

### Routes
|METHOD| ROUTE| FUNCTION|
|:-----|:----:|:------:|
| GET   | `/` | `general search page` |
| GET   | `/auth/signup` | `render sign-in page` |
| GET   | `/auth/login` | `render login page` |
| GET   | `/auth/logout` | `deletes the session and logs out` |
| POST  | `/auth/signup` | `accepts data and checks in` |
| POST  | `/auth/login` | `accepts data and checks authentication` |
| GET   | `/search` | `finds search results and renders map` |
| GET   | `/search/:id` | `renders individual store data` |
| GET   | `/profile` | `finds stores saved by user and renders them` |
| GET   | `/profile/:id` | `renders one saved store and accompanying notes` |
| POST  | `/profile/add/:id` | `add selected store to the user's saved stores` |
| POST  | `/profile/:id/notes` | `post a note to a saved store` |
| PUT   | `/profile/:id/update` | `mark a store as "visited"` |
| DELETE| `/profile/:id` | `remove store from user's saved stores` |