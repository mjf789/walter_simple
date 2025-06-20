## Standard Workflow
1. First think through the problem, read the codebase for relevant files, and write a plan to projectplan.md.
2. The plan should have a list of todo items that you can check off as you complete them.
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please, every step of the way just give me a high level explanation of what changes you made.
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity, unless the simple solutions are not working.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

## TXT File Format Reference
When working with Qualtrics TXT format files, ALWAYS reference:
1. `/Users/mattfranco/Desktop/walter_simple/qualtrics_txt_format.txt` - Contains official Qualtrics TXT format specifications

Key TXT format notes:
- Use Simple Format for basic surveys (multiple choice and matrix questions)
- Each question separated by 2 blank lines
- Export tag (e.g., "Q1.") followed by question text
- 1 blank line between question text and answer choices
- For likert scales: list each scale point on its own line (e.g., "1 = Strongly Disagree")
- Advanced Format available for more complex surveys with [[tags]]