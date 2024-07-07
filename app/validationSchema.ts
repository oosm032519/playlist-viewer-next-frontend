import * as yup from "yup";

export const schema = yup.object({
    query: yup
        .string()
        .required("検索クエリを入力してください")
        .min(2, "最低2文字以上入力してください"),
}).required();
