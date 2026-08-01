# Express JS

Express.js practice covering application setup, routers, middleware ordering, dynamic route parameters, static files, JSON responses, and EJS rendering.

## Examples

- `main.js` runs the primary server on port `3000`, mounts `/blog` and `/shop`, writes request methods to `logs.txt`, serves `public/index.html`, and exposes `/api`.
- `routes/blog.js` demonstrates router-local middleware plus `/blog/`, `/blog/about`, and `/blog/blogpost/:slug`.
- `routes/shop.js` demonstrates a second mounted router.
- `EJS Tutorial/` is a separate Express/EJS app with a home view and a dynamic `/blog/:slug` page.
- `Practice/` contains file-system and file-type handling examples with sample JPG, PNG, PDF, TXT, and ZIP files.

## Run an example

```bash
npm install
node main.js
```

For the EJS example:

```bash
cd "EJS Tutorial"
npm install
node index.js
```

Both examples use port `3000`, so run them separately or change the port in the source.
