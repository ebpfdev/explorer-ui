v0.0.4 // 13 june 2023 / map editor and map pins
--

* map entries table is now editable (for Array(perCPU)/Hash(perCPU) maps)
* displaying map pins to filesystem

v0.0.3 // 11 june 2023 / more connections
--

* (feature) new Graph View for exploring connected programs and maps (available from details page of both)
* (feature) showing list of tracepoints that program is attached to on program's details page

v0.0.2 // 4 june 2023 / neat fixes
--

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