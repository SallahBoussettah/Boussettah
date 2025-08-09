# Project JSON Upload Guide

This guide explains how to use the JSON upload feature in the admin dashboard to bulk import projects.

## How to Use

1. **Access the Feature**: Go to the admin dashboard and navigate to the "Projects" tab
2. **Click Upload JSON**: Click the green "Upload JSON" button next to "Add Project"
3. **Prepare Your Data**: Use one of the template files or create your own JSON file
4. **Upload**: Either drag and drop your JSON file or paste the JSON content directly

## JSON Format Requirements

### Required Structure
Your JSON file must have this basic structure:
```json
{
  "projects": [
    // Array of project objects
  ]
}
```

### Required Fields
Each project object must have at least:
- `title` (string): Project name
- `category` (string): Must be one of: "web", "mobile", "game", "desktop"

### Optional Fields
All other fields are optional but recommended:

#### Basic Information
- `subtitle` (string): Brief project description
- `description` (string): Detailed project description
- `longDescription` (string): Extended technical description
- `shortDescription` (string): Brief summary (max 500 chars)

#### Project Details
- `status` (string): "planning", "in-progress", "completed", "on-hold" (default: "planning")
- `difficulty` (string): "beginner", "intermediate", "advanced"
- `year` (string): Project year (4 digits)
- `teamSize` (number): Number of team members (default: 1)
- `duration` (string): Project duration description
- `client` (string): Client or company name

#### Arrays (can be strings separated by commas or actual arrays)
- `technologies` (array): ["React", "Node.js", "MongoDB"]
- `features` (array): List of key features
- `challenges` (array): Technical challenges faced
- `learnings` (array): What was learned from the project
- `tags` (array): Project tags for categorization
- `awards` (array): Any awards or recognition received
- `images` (array): Additional image URLs (main image uploaded separately)

#### URLs
- `githubUrl` (string): GitHub repository URL
- `liveUrl` (string): Live demo URL
- `demoUrl` (string): Demo or preview URL

#### Dates
- `startDate` (string): ISO date string or YYYY-MM-DD format
- `endDate` (string): ISO date string or YYYY-MM-DD format

#### Display Settings
- `featured` (boolean): Whether to feature this project (default: false)
- `priority` (number): Display priority (higher = more prominent, default: 0)
- `isPublic` (boolean): Whether project is publicly visible (default: true)
- `completionPercentage` (number): 0-100 completion percentage

#### Statistics (optional)
- `stars` (string): GitHub stars count
- `downloads` (string): Download count

## Template Files

### Simple Template (`simple-project-template.json`)
Contains minimal required fields - good for quick imports.

### Full Template (`project-template.json`)
Contains all possible fields with examples - good for comprehensive project data.

## Usage Tips

1. **Start Small**: Begin with the simple template and add more fields as needed
2. **Images**: The JSON upload doesn't handle images - upload them separately after import
3. **Validation**: The system will validate your data and show detailed error messages
4. **Batch Processing**: You can upload multiple projects at once
5. **Error Handling**: Failed imports won't affect successful ones - you'll get a detailed report

## Example Workflow

1. Copy `simple-project-template.json`
2. Replace the example data with your project information
3. Add more projects to the array as needed
4. Upload via the dashboard
5. Review the import results
6. Edit individual projects to add images and fine-tune details

## Common Issues

- **Invalid Category**: Make sure category is exactly one of: "web", "mobile", "game", "desktop"
- **Invalid JSON**: Use a JSON validator to check your syntax
- **Missing Title**: Every project must have a title
- **Date Format**: Use ISO format (YYYY-MM-DD) for dates
- **URL Format**: URLs must include http:// or https://

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Validate your JSON syntax
3. Ensure all required fields are present
4. Check that array fields are properly formatted