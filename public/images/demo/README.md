# Demo Images Folder

This folder contains demo images for the ACEIB Educational Platform.

## Usage

Images placed in this folder can be accessed via the web application at:
```
/images/demo/filename.jpg
```

## File Naming Convention

- Use descriptive names: `math-tutoring-session.jpg`, `chemistry-lab-demo.png`
- Include context: `mentor-profile-dr-smith.jpg`, `student-dashboard-screenshot.png`
- Use hyphens instead of spaces: `pairing-confirmation-dialog.jpg`

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

## Current Demo Images

### Available Images:
- **demo 1.png** (300KB): [Description needed - please update]
- **demo 2.png** (360KB): [Description needed - please update]
- **demo 3.png** (445KB): [Description needed - please update]
- **demo 4.png** (273KB): [Description needed - please update]

### Recommended Image Types

- **Screenshots**: UI mockups, feature demonstrations
- **Profile Pictures**: Sample mentor/student avatars
- **Session Photos**: Tutoring session examples
- **Subject Illustrations**: Math problems, science diagrams
- **Platform Assets**: Logos, icons, banners

## File Size Guidelines

- Web images: Keep under 500KB per image
- Thumbnails: Optimize to under 100KB
- Icons: Keep under 50KB

## Usage Examples

Images in `public/images/demo/` can be referenced in Vue components:

```vue
<template>
  <!-- Basic image usage -->
  <img src="/images/demo/demo 1.png" alt="Demo Image 1" />

  <!-- In Vuetify components -->
  <v-card>
    <v-img src="/images/demo/demo 2.png" height="200px"></v-img>
    <v-card-text>Demo Image 2</v-card-text>
  </v-card>

  <!-- As background images -->
  <div
    class="hero-section"
    :style="{ backgroundImage: 'url(/images/demo/demo 3.png)' }"
  ></div>

  <!-- In avatar components -->
  <v-avatar size="64">
    <img src="/images/demo/demo 4.png" alt="Demo Avatar" />
  </v-avatar>
</template>

<style scoped>
.hero-section {
  height: 300px;
  background-size: cover;
  background-position: center;
}
</style>
```

## Organization

```
demo/
├── mentors/          # Mentor profile images
├── students/         # Student profile images
├── sessions/         # Session/tutorial images
├── subjects/         # Subject-specific illustrations
├── ui/              # UI screenshots and mockups
└── features/        # Feature demonstration images
```
