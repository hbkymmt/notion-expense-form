import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import '../App.css';

const ExpenseForm: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [item, setItem] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [method, setMethod] = useState("");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 日付の初期化
    useEffect(() => {
        const today = new Date();
        const formatted = today.toISOString().split("T")[0];  // "YYYY-MM-DD"
        setDate(formatted);
    }, []);

    const handleSubmit = async () => {
        // 必須項目（amount, item, date）が空ならアラートを出して送信中止
        if (!amount || !item || !date || !category || !method) {
            alert("Fill in the all blank!");
            return;
        }

        setIsLoading(true);
    
        try {
            // バックエンドのエンドポイントに対して POST リクエストを送る
            const response = await fetch(`${API_URL}/add-expense`, {
                method: 'POST', // POST メソッドを指定（データ送信）
                headers: {
                    "Content-Type": "application/json" // JSON 形式のデータであることを明示
                },
                body: JSON.stringify({
                    amount,    // 金額
                    item,      // 商品名
                    category,  // カテゴリ（セレクト）
                    date,      // 日付
                    method,    // 支払い方法（セレクト）
                    notes      // メモ（テキスト）
                })
            });
    
            // 通信成功（ステータス200台）なら
            if (response.ok) {
                alert("Expenses Added!"); // 成功メッセージを表示
    
                // 入力欄をすべて初期化（フォームのリセット）
                setAmount('');
                setItem('');
                setCategory('');
                // setDate('');
                // setMethod('');
                setNotes('');
            } else {
                // サーバーからのレスポンスはあるが、エラー（400台など）の場合
                alert("A networking error has occured.");
            }
        } catch (error) {
            // 通信自体が失敗した場合（ネットワーク不通、サーバーが落ちているなど）
            alert("Internet connection has failed.");
            console.error(error); // コンソールに詳細なエラーを出力（デバッグ用）
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Add an expense!</h2>
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <input type="text" placeholder="Item" value={item} onChange={e => setItem(e.target.value)} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">-- Select Category --</option> 
                <option value="Food & Drinks">Food & Drinks</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Home">Home</option>
                <option value="Transport">Transport</option>
                <option value="Subscription">Subscription</option>
                <option value="Others">Others</option>
            </select>
            <select value={method} onChange={e => setMethod(e.target.value)}>
                <option value="">-- Select Method --</option>
                <option value="楽天Mastercard">楽天Mastercard</option>
                <option value="楽天Visa">楽天Visa</option>
                <option value="三井Visa">三井住友Visa</option>
                <option value="デビット">デビット</option>
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <textarea
                placeholder="Notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
            />
            <button onClick={handleSubmit}>Add</button>

            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Sending..." : "Add"}
            </button>
        </div>
    );
};

export default ExpenseForm;