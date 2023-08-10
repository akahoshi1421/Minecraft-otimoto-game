# Minecraft-INIAD-locker
Minecraft統合版及びEducation EditionにおいてMinecraftから東洋大学情報連携学部(INIAD)のロッカーを開けるようにするためのWebSocketサーバです。

Education Editionにおける使い方は[こちら](https://github.com/akahoshi1421/Minecraft-INIAD-locker/blob/main/README-edu.md)

## 使い方
1. パッケージをインストールする
    ```shell
    npm i
    ```

2. .envファイルをプロジェクト直下のディレクトリに作成する
    ```shell
    touch .env
    ```

3. .envファイルに以下のような記述する

    ```.env
    URL="{{ API_URL }}"
    API_KEY="{{ YOUR_API_KEY }}"
    ```
    URLは特別な事情がなければ "https://api.iniad.org/api/v1/locker/open" になると思います。
    API_KEYは"@iniad.orgなしのメールアドレス:パスワード"になります。

4. サーバを走らせる
    ```shell
    node server.js
    ```

5. PowerShellを管理者権限で起動し、以下のコマンドを実行
    ```shell
    CheckNetIsolation.exe LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
    ```

6. Minecraftのワールド設定を開き以下を変更

    設定 -> ゲーム -> Education Edition の項目をオンにする

7. Minecraftのワールドに入り、以下の設定を変更する

    設定 -> 一般 -> "暗号化された WebSocket の要求" の項目をオフにする

8. Minecraftのチャットから以下のコマンドを入力
    ```.mcfunction
    /wsserver localhost:9999
    ```
    正常に動いていたら"サーバーへの接続を確立しました: ws://localhost:9999"と表示されます。

8. Minecraftのチャットから以下の文章を入力
    ```
    /say open
    ```
    するとあなたのロッカーが開錠されます。(コマンドブロックからでも開錠可能です。)