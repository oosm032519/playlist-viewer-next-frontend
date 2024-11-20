// app/validationSchema.ts

import * as yup from "yup";

/**
 * yupを使用してバリデーションスキーマを定義。
 * このスキーマは、検索クエリのバリデーションを行い。
 */
export const schema = yup.object({
    /**
     * queryフィールドのバリデーションを定義する。
     * - 必須フィールドであること
     * - 最低2文字以上であること
     */
    query: yup
        .string()
        .required("検索クエリを入力してください") // 必須フィールドのエラーメッセージ
        .min(2, "最低2文字以上入力してください"), // 最小文字数のエラーメッセージ
}).required(); // スキーマ全体が必須であることを示します
