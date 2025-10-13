class MixpeekMcp < Formula
  desc "Mixpeek MCP server launcher (invokes npm package @mixpeek/mcp)"
  homepage "https://github.com/mixpeek/mcp-server"
  version "0.1.0"

  depends_on "node"

  def install
    (bin/"mixpeek-mcp").write <<~EOS
      #!/bin/bash
      exec npx -y @mixpeek/mcp "$@"
    EOS
    chmod 0755, bin/"mixpeek-mcp"
  end

  test do
    system "#{bin}/mixpeek-mcp", "--version"
  end
end


