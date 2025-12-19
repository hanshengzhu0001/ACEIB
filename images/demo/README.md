# Demo Images Repository

This folder serves as a repository for organizing demo images before they are moved to the appropriate locations in the application.

## Current Status

**4 demo images added to public/images/demo/** (demo 1.png - demo 4.png)

## Folder Structure

```
images/demo/
├── mentors/          # Mentor profile images and assets
├── students/         # Student profile images and assets
├── sessions/         # Session photos and tutorial materials
├── subjects/         # Subject-specific illustrations and diagrams
├── ui/              # UI screenshots, mockups, and wireframes
├── features/        # Feature demonstration images
├── marketing/       # Marketing materials and promotional images
└── temp/           # Temporary images pending review/organization
```

## Workflow

1. **Upload to `images/demo/`**: Place new images here first
2. **Organize by category**: Move to appropriate subfolders
3. **Optimize for web**: Compress and resize as needed
4. **Move to public**: Copy optimized versions to `public/images/demo/`
5. **Update references**: Update any code references to use the new images

## Image Optimization

Before moving images to `public/images/demo/`, optimize them for web use:

- **Resize**: Reduce dimensions while maintaining quality
- **Compress**: Use tools like ImageOptim, TinyPNG, or WebP conversion
- **Format**: Convert to WebP for modern browsers, fall back to JPEG/PNG

## Usage in Code

Images in `public/images/demo/` can be referenced in components:

```vue
<template>
  <img src="/images/demo/mentors/dr-smith.jpg" alt="Dr. Smith" />
</template>
```

## File Naming

- Use kebab-case: `math-tutoring-session.jpg`
- Include context: `mentor-profile-card.jpg`
- Avoid special characters: `chemistry-lab-equipment.png`

## Maintenance

- Regularly review and remove unused images
- Update this README when adding new categories
- Keep both folders in sync for development
