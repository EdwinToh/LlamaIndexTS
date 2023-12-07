# コアモジュール

`このドキュメントは自動的に翻訳されており、誤りを含んでいる可能性があります。変更を提案するためにプルリクエストを開くことを躊躇しないでください。`

LlamaIndex.TSには、いくつかのコアモジュールがあります。これらは、すぐに始めるための高レベルモジュールと、必要に応じて主要なコンポーネントをカスタマイズするための低レベルモジュールに分かれています。

## 高レベルモジュール

- [**Document**](./high_level/documents_and_nodes.md): ドキュメントは、テキストファイル、PDFファイル、または他の連続したデータを表します。

- [**Node**](./high_level/documents_and_nodes.md): 基本的なデータの構築ブロックです。一般的には、これらはドキュメントの一部であり、埋め込みモデルとLLMに供給するのに十分に小さな管理可能なピースに分割されます。

- [**Reader/Loader**](./high_level/data_loader.md): リーダーまたはローダーは、現実世界のドキュメントを受け取り、Documentクラスに変換してIndexとクエリで使用できるようにするものです。現在、プレーンテキストファイルとPDFをサポートしており、今後さらに多くの形式をサポートする予定です。

- [**Indexes**](./high_level/data_index.md): インデックスは、ノードとそれらのノードの埋め込みを格納します。

- [**QueryEngine**](./high_level/query_engine.md): クエリエンジンは、入力したクエリを生成し、結果を返すものです。クエリエンジンは、通常、事前に構築されたプロンプトとIndexから選択されたノードを組み合わせて、LLMがクエリに答えるために必要なコンテキストを提供します。

- [**ChatEngine**](./high_level/chat_engine.md): ChatEngineは、Indexと対話するチャットボットを構築するのに役立ちます。

## 低レベルモジュール

- [**LLM**](./low_level/llm.md): LLMクラスは、OpenAI GPT-4、Anthropic Claude、またはMeta LLaMAなどの大規模言語モデルプロバイダーに対する統一されたインターフェースです。独自の大規模言語モデルに接続するために、このクラスをサブクラス化することができます。

- [**Embedding**](./low_level/embedding.md): 埋め込みは、浮動小数点数のベクトルとして表されます。OpenAIのtext-embedding-ada-002は、デフォルトの埋め込みモデルであり、生成される各埋め込みは1,536個の浮動小数点数で構成されています。もう1つの人気のある埋め込みモデルはBERTであり、各ノードを表すために768個の浮動小数点数を使用します。埋め込みを使用するためのさまざまなユーティリティを提供しており、3つの類似性計算オプションと最大限のマージナルリレバンスを含んでいます。

- [**TextSplitter/NodeParser**](./low_level/node_parser.md): テキストの分割戦略は、埋め込み検索の全体的な効果に非常に重要です。現在、デフォルトの分割方法がありますが、ワンサイズフィットオールの解決策はありません。ソースドキュメントに応じて、異なる分割サイズと戦略を使用することができます。現在、固定サイズでの分割、オーバーラップセクションを持つ固定サイズでの分割、文での分割、段落での分割をサポートしています。テキストスプリッターは、`Document`を`Node`に分割する際にNodeParserによって使用されます。

- [**Retriever**](./low_level/retriever.md): Retrieverは、実際にインデックスからノードを選択する役割を果たします。ここでは、クエリごとにより多くまたはより少ないノードを取得したり、類似性関数を変更したり、アプリケーションの個々のユースケースごとに独自のリトリーバーを作成したりすることができます。たとえば、コードコンテンツとテキストコンテンツに対して別々のリトリーバーを使用したい場合があります。

- [**ResponseSynthesizer**](./low_level/response_synthesizer.md): ResponseSynthesizerは、クエリ文字列を受け取り、`Node`のリストを使用して応答を生成する役割を担っています。これには、すべてのコンテキストを反復処理して回答を洗練させる方法や、サマリのツリーを構築してルートサマリを返す方法など、さまざまな形式があります。

- [**Storage**](./low_level/storage.md): インデックス、データ、ベクトルを再実行する代わりに、いずれかの時点でインデックス、データ、ベクトルを保存したくなるでしょう。IndexStore、DocStore、VectorStore、およびKVStoreは、それを実現するための抽象化です。これらを組み合わせると、StorageContextが形成されます。現在、埋め込みをファイルシステム上のファイル（または仮想インメモリファイルシステム）に永続化することができますが、ベクトルデータベースへの統合も積極的に追加しています。