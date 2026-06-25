import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PageHeader } from "@/components/shared/page-header";

describe("PageHeader", () => {
  it("renders the title as the level-1 heading", () => {
    render(<PageHeader title="Users" />);
    expect(screen.getByRole("heading", { level: 1, name: "Users" })).toBeInTheDocument();
  });
});
