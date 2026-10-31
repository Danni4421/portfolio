export class ProjectSlug {
  static generate(stringValue: string) {
    return stringValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }
}
