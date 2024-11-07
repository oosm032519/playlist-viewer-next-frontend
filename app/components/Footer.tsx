// app/components/Footer.tsx
"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/ui/dialog"
import {cn} from "@/app/lib/trackUtils";

export default function Footer() {
    return (
        <footer className="bg-muted p-4 mt-8">
            <div className="container mx-auto flex justify-center items-center">
                <div className="space-x-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <a className="text-foreground hover:underline cursor-pointer">利用規約</a>
                        </DialogTrigger>
                        <DialogContent className={cn("bg-background")}>
                            <DialogTitle>利用規約</DialogTitle>
                            <DialogDescription>
                                <p>本利用規約は、運営者が個人で運営するWebアプリケーション「Playlist
                                    Viewer」（以下、「本サービス」）における、ユーザーの利用条件を定めたものです。本サービスを利用する前に、以下の利用規約をよくお読みいただき、同意の上でご利用ください。</p>
                                <br/>
                                
                                <h3>1. サービス内容</h3>
                                <p>本サービスは、Spotifyのプレイリストを閲覧、分析、操作するためのツールを提供します。ユーザーはSpotifyアカウントでログインし、プレイリストの検索、詳細情報の表示、推奨トラックの取得、プレイリストへのトラックの追加・削除、新しいプレイリストの作成などができます。本サービスはSpotify
                                    APIを利用しており、Spotifyの利用規約にも準拠する必要があります。</p>
                                <br/>
                                
                                <h3>2. 利用制限</h3>
                                <ul>
                                    <li>- 本サービスを不正な目的で使用することは禁止します。</li>
                                    <li>- 本サービスを利用して、著作権法、商標法、その他の法律に違反する行為をしないものとします。</li>
                                    <li>- Spotify APIの利用制限を超えるアクセスを行うことは禁止します。</li>
                                </ul>
                                <br/>
                                
                                <h3>3. 知的財産権</h3>
                                <p>本サービスで表示されるコンテンツに関する知的財産権は、それぞれの権利者に帰属します。</p>
                                <br/>
                                
                                <h3>4. 免責事項</h3>
                                <ul>
                                    <li>- 運営者は、本サービスの利用によって生じた損害について、一切の責任を負いません。</li>
                                    <li>- 運営者は、本サービスの提供を予告なく中断または停止することがあります。</li>
                                    <li>- 本サービスは、Spotifyとは一切関係ありません。Spotify APIの利用規約はSpotifyが定めており、運営者はSpotify APIの変更または停止による影響について責任を負いません。</li>
                                    <li>- 本サービスで表示される情報は、Spotify APIから取得したデータに基づいており、その正確性や完全性を保証するものではありません。</li>
                                </ul>
                                <br/>
                                
                                <h3>5. 利用規約の変更</h3>
                                <p>運営者は、必要に応じて本利用規約を変更することがあります。変更後の利用規約は、本サービス上に掲載した時点で効力を生じるものとします。</p>
                                <br/>
                                
                                <h3>6. 準拠法</h3>
                                <p>本利用規約は、日本法に準拠するものとします。</p>
                                <br/>
                                
                                <h3>7. お問い合わせ</h3>
                                <p>本利用規約に関するお問い合わせは、oosm032519@gmail.comまでご連絡ください。</p>
                                <br/>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <a className="text-foreground hover:underline cursor-pointer">プライバシーポリシー</a>
                        </DialogTrigger>
                        <DialogContent className={cn("bg-background")}>
                            <DialogTitle>プライバシーポリシー</DialogTitle>
                            <DialogDescription>
                                <p>本プライバシーポリシーは、運営者が個人で運営するWebアプリケーション「Playlist
                                    Viewer」（以下、「本サービス」）における、ユーザーの個人情報の取扱いについて定めたものです。</p>
                                <br/>
                                
                                <h3>1. 個人情報の取得</h3>
                                <p>本サービスは、以下の方法でユーザーの個人情報を取得することがあります。</p>
                                <ul>
                                    <li>- Spotifyアカウントによるログイン:
                                        ユーザーがSpotifyアカウントでログインする際に、ユーザーID、表示名などのSpotifyから提供されるユーザー情報を取得します。
                                    </li>
                                    <li>- プレイリスト情報:
                                        本サービスの利用状況に応じて、ユーザーがSpotifyで作成またはフォローしているプレイリストのID、名前、トラックリストなどの情報を取得します。
                                    </li>
                                    <li>- お気に入りプレイリスト機能:
                                        ユーザーのプレイリストへのアクセス利便性向上のため、お気に入り登録したプレイリスト情報を取得します。
                                    </li>
                                </ul>
                                <br/>
                                
                                <h3>2. 個人情報の利用目的</h3>
                                <p>取得した個人情報は、以下の目的で利用します。</p>
                                <ul>
                                    <li>- 本サービスの提供</li>
                                    <li>- 本サービスの機能改善および新機能開発</li>
                                </ul>
                                <br/>
                                
                                <h3>3. 個人情報の第三者提供</h3>
                                <p>運営者は、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。</p>
                                <br/>
                                
                                <h3>4. 個人情報の管理</h3>
                                <p>運営者は、取得した個人情報を適切に管理し、不正アクセス、紛失、破壊、改ざん、漏洩などの防止に努めます。</p>
                                <br/>
                                
                                <h3>5. データ保持期間</h3>
                                <p>運営者は、個人情報の利用目的が達成された時点で、個人情報を消去または匿名化します。</p>
                                <br/>
                                
                                <h3>6. プライバシーポリシーの変更</h3>
                                <p>運営者は、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、本サービス上に掲載した時点で効力を生じるものとします。</p>
                                <br/>
                                
                                <h3>7. お問い合わせ</h3>
                                <p>個人情報の取扱いに関するお問い合わせは、oosm032519@gmail.comまでご連絡ください。</p>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </footer>
    );
}
