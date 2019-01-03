workflow "Publish plugin to wordpress.org" {
  on = "push"
  resolves = ["wordpress.org"]
}

# Filter for tag
action "tag" {
  uses = "actions/bin/filter@master"
  args = "tag"
}

# Install Dependencies
action "install" {
  uses = "actions/npm@e7aaefe"
	needs = "tag"
  args = "install"
}

# Build Plugin/Theme
action "build" {
  uses = "actions/npm@e7aaefe"
  needs = ["install"]
  args = "run build"
}

# Create Release ZIP archive
action "archive" {
  uses = "lubusIN/actions/archive@master"
  needs = ["build"]
  env = {
		ARCHIVE_FILENAME = "block-background"
		}
}

# Publish to wordpress.org repository
action "wordpress.org" {
  uses = "lubusIN/actions/wordpress@master"
  needs = ["archive"]
  args = "block-background"
	env = {
		WP_SLUG = "block-background"
	}
  secrets = ["WP_USERNAME", "WP_PASSWORD"]
}
