# LYS Finder

Search your neighborhood for local yarn stores!

![search](/public/img/search-view.png)

## Resources
### APIS
- [Ravelry API](https://www.ravelry.com/api)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)

### Libraries Used
 - NodeJS
 - Express
 - Bootstrap

### Dependencies
Mapbox, Axios, Postgres, Sequelize...
For a complete list, please see the package.json. 

## Design

I started with a general idea of what I wanted to create: a search page and a general information page for each page.
#### Search Page with Map
![wireframes](/public/img/search-wireframe.png)

#### Store Information Page
![wireframes](/public/img/store-view-wireframe.png)

## Planning

### Models
The next thing that I focused on was what sort of data I'd want to save and what would be better to call from the API I decided to use. Looking at the information I got back from the API, I didn't need to save a ton of that information to my databases; it would be better to leave things like addresses out and call the API when I needed them.

![models](/public/img/models.png)


### Routes
I planned these out after I knew what my models and API data would be.

|METHOD| ROUTE| FUNCTION|
|:-----|:----:|:------:|
| GET   | `/` | `general search page` |
| GET   | `/auth/signup` | `render sign-in page` |
| GET   | `/auth/login` | `render login page` |
| GET   | `/auth/logout` | `deletes the session and logs out` |
| POST  | `/auth/signup` | `accepts data and checks in` |
| POST  | `/auth/login` | `accepts data and checks authentication` |
| GET   | `/search` | `finds search results and renders map (calls API)` |
| GET   | `/search/:id` | `renders individual store data (calls API)` |
| GET   | `/profile` | `finds stores saved by user and renders them` |
| GET   | `/profile/:id` | `renders one saved store and accompanying notes (calls API)` |
| POST  | `/profile/add/:id` | `add selected store to the user's saved stores` |
| POST  | `/profile/:id/notes` | `post a note to a saved store` |
| PUT   | `/profile/:id/update` | `mark a store as "visited"` |
| DELETE| `/profile/:id` | `remove store from user's saved stores` |

## Process


## Known Problems
- depending on the notes_html coming from the API, there are occasionally broken images that are not being rendered into the page correctly.

## Future Additions/Edits
- [ ] if no user is logged in, the favorite button is invisible when the search page renders
- [ ] display brands recently purchased at the store
- [ ] display specific hours the store is open, if information is available
- [ ] complete map of all stores saved by user
- [ ] ability for user to edit their own profile (name, email, change password...)