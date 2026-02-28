# api

To install dependencies:

```bash
bun install
```

Start local Postgres:

```bash
bun run db:up
```

Generate migrations and apply them:

```bash
bun run db:generate
bun run db:migrate
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
