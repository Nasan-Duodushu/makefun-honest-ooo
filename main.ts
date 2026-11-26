// The Painfully Honest Out-of-Office — entry program.
// Writes one auto-reply (<=200 chars) to /output/entry.txt: brutally honest
// about the inbox backlog, still polite enough that a manager would let it
// stand. The honesty is the point — "in the order received" quietly admits
// the reply may never come — and the politeness is the wrapper: thank you,
// a return date, and "honestly" doing the confessing.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

class AutoReply {
  private readonly text: string;

  constructor(text: string) {
    this.text = text;
    this.validate();
  }

  get length(): number {
    return this.text.length;
  }

  private validate(): void {
    const line = this.text.trim();
    if (line.length === 0 || line.length > 200) {
      throw new Error("auto-reply fails the 1-200 character gate");
    }
    if (line.includes("\n")) {
      throw new Error("auto-reply must be a single line");
    }
    // Brief-fit self-check: it must thank the sender, name the return day,
    // and confess the backlog honestly — without sounding like a form letter.
    if (!/^Thank you/i.test(line) || !/Monday/i.test(line)) {
      throw new Error("auto-reply must thank the sender and name the return day");
    }
    if (!/honestly/i.test(line)) {
      throw new Error("auto-reply must own the honesty in its own words");
    }
  }

  deliver(outDir: string): string {
    const target = join(resolve(outDir), "entry.txt");
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    writeFileSync(target, this.text, "utf8");
    return target;
  }
}

const reply = new AutoReply(
  "Thank you for your email. I am on leave until Monday and will answer it then, in the order received — which, honestly, means it may never be answered at all.",
);
const target = reply.deliver(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
console.log(`wrote ${reply.length} chars to ${target}`);
