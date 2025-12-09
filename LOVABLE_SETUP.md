# Lovable Setup Instructions

This project uses a monorepo structure with the frontend in the `frontend/` directory. 

## For Lovable Integration

Lovable expects frontend files at the root level. The root `package.json` and `vite.config.ts` are configured to work with the frontend in the `frontend/` subdirectory.

### Current Structure
```
/
├── package.json       # Root package.json (includes frontend deps)
├── vite.config.ts     # Vite config (points to ./frontend)
├── tsconfig.json      # TypeScript config (references frontend)
├── index.html         # HTML entry point
├── frontend/          # Frontend source code
│   ├── src/          # React source files
│   ├── public/       # Static assets
│   └── ...
└── backend/          # Backend (Rust)
```

### Vite Configuration

The `vite.config.ts` uses `root: "./frontend"` to point to the frontend directory while keeping config files at root for Lovable detection.

### If Lovable Still Doesn't Recognize

If Lovable doesn't automatically detect the project:

1. **Option 1**: Point Lovable to the `frontend/` directory in project settings
2. **Option 2**: Move frontend files to root (requires restructuring)
3. **Option 3**: Create a separate repository for the frontend

### Installing Dependencies

From the root directory:
```bash
npm install
```

This will install all frontend dependencies listed in the root `package.json`.

