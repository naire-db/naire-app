```typescript
interface Resp {  // 'body' of Resp
  answers: any[]
}
```

| `q.type`                | `any`                                | desc                                             |
|-------------------------|--------------------------------------|--------------------------------------------------|
| input, text             | string                               |                                                  |
| radio                   | int                                  | oid                                              |
| checkbox                | int[]                                | oids                                             |
| dropdown                | int                                  | oid                                              |
| file (optional = false) | [string, string, number]             | [attachment token, filename, file size in bytes] |
| file (optional = true)  | [string, string, number] &#124; null |                                                  |
| datetime                | int                                  | Unix timestamp                                   |
| date                    | int                                  | Unix timestamp at 00:00:00                       |
| comment                 | null                                 |                                                  |
