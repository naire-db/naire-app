```typescript
interface Form {  // 'body' of Form
  questions: Question[];
}

interface Question { // abstract
  id: int;

  title: string;
  image_ids: int[];  // For use in image src url

  conds: Condition[];
  cond_or: boolean;  // true for 'or', false for 'and'

  type: 'input' | 'text' | 'radio' | 'checkbox' |
        'dropdown' | 'file' | 'date' | 'time' |
        'datetime' | 'comment' |
        'geo' | 'fuzzy_geo' | 'ip';
  // Marks the derived type
}

interface InputQuestion extends Question {
  min_length: int;
  max_length: int;
  regex?: string;
}

interface TextQuestion extends Question {
  min_length: int;
  max_length: int;
}

interface RadioQuestion extends Question {
  options: Option[];  // Non-empty
}

interface CheckboxQuestion extends Question {
  options: Option[];  // Non-empty
  min_choices: int;
  max_choices: int;
}

interface DropdownQuestion extends Question {
  options: Option[];
}

interface FileQuestion extends Question {
  extensions: string[];  // Accepts all extensions if empty
}

// Other types have no specific fields

interface Option {
  id: int;
  text: string;
}

interface Condition {
  oid: int;  // Option id; only radio / checkbox / dropdown questions can be referred
  negated: boolean;
}
```
