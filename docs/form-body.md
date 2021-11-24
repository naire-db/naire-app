```typescript
interface Form {  // 'body' of Form
  questions: Question[];
}

interface Question { // abstract
  id: int;

  title: string;
  image_ids: int[];  // for use in image src url
  
  conds: Condition[];
  cond_or: boolean;  // true means 'or', false means 'and'
  
  type: 'text' | 'radio' | 'checkbox' |
        'dropdown' | 'file' | 'date' | 'time' |
        'datetime' | 'comment';
  // marks the derived type
}

interface TextQuestion extends Question {
  min_length: int;
  max_length: int;
  regex?: string;
  multi_lined: boolean;
}

interface RadioQuestion extends Question {
  options: Option[];
}

interface CheckboxQuestion extends Question {
  options: Option[];
  min_choices: int;
  max_choices: int;
}

interface DropdownQuestion extends Question {
  options: Option[];
}

interface FileQuestion extends Question {
  extensions: string[];  // accepts all extensions if empty
}

// Other types have no specific fields

interface Option {
  id: int;
  text: string;
}

interface Condition {
  qid: int;  // Only radio / checkbox / dropdown questions can be referred
  oid: int;  // option id
  negated: boolean;
}
```
