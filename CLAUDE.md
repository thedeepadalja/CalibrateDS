@AGENTS.md

<!-- dna:agent-instructions:start -->
## Design system conformance (@calibrate-ds/dna)

This project tracks a design-system identity with `@calibrate-ds/dna`. If you are a
coding agent editing this codebase and `dna mcp` is configured as an MCP server in
your client, use its tools on your own initiative — no user step required:

1. **Before creating a new component**, call `dna_inventory` and `dna_similar` to
   check whether something equivalent already exists rather than reinventing it.
2. **After editing a design-relevant file** (styles, tokens, component markup),
   call `dna_check` to verify the change did not drift from the recorded identity.
3. These tools only work if `dna mcp` is configured as an MCP server in your
   client — if it isn't available, this convention is a no-op; see this package's
   `dna mcp` documentation to configure it.

This is a cooperation convention, not an enforcement mechanism — if a pre-commit
hook (`dna hook install`) is installed, that remains the real backstop regardless
of whether an agent follows these steps.
<!-- dna:agent-instructions:end -->
