v0.0.2 // 4 june 2023 / neat fixes

* layout now take all screen space
* sidebar
  * programs and maps can be opened in new tabs (middle click / ctrl or whatever)
* map details
  * format values as numbers by default if value size <= 8 bytes
  * moved entries table to a separate page
  * horizontal scroll for entries table
    * fixed key column
* programs details
  * fixed run time format
  * added average run time

v0.0.1 // 28 may 2023 / GraphQL kickstarted
--

* react web app, which consumes GraphQL API
    * displays all programs and maps in a file tree on a sidebar
    * pages for viewing program and map details
        * on a map page, displays entries in a table with pagination