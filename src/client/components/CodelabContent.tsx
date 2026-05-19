type CodelabContentProps = {
  html: string;
};

/**
 * Renders server-produced step HTML inside an isolated scope.
 * All author styles are applied via `.codelab-content` in CSS, not inline from markdown.
 */
export function CodelabContent({ html }: CodelabContentProps) {
  if (!html.trim()) {
    return (
      <p className="codelab-content-empty" role="status">
        This step has no content yet.
      </p>
    );
  }

  return <div className="codelab-content-host" dangerouslySetInnerHTML={{ __html: html }} />;
}
