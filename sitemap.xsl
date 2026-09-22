<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | GlassStudio Hyderabad</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: #333333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 30px 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          .header {
            background-color: #92837c;
            color: #ffffff;
            padding: 30px;
            border-bottom: 3px solid #7a6c65;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 26px;
            font-weight: 700;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 15px;
          }
          .content {
            padding: 25px 30px;
          }
          .stats {
            background-color: #f1edea;
            border-left: 4px solid #92837c;
            padding: 12px 18px;
            margin-bottom: 25px;
            font-size: 14px;
            color: #555555;
            border-radius: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          th {
            background-color: #f4f4f6;
            color: #120f2d;
            text-align: left;
            padding: 12px 15px;
            font-weight: 600;
            border-bottom: 2px solid #dee2e6;
          }
          td {
            padding: 12px 15px;
            border-bottom: 1px solid #eeeeee;
          }
          tr:hover td {
            background-color: #faf9f8;
          }
          a {
            color: #92837c;
            text-decoration: none;
            word-break: break-all;
            font-weight: 500;
          }
          a:hover {
            color: #120f2d;
            text-decoration: underline;
          }
          .priority-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            background-color: #e9ecef;
            color: #495057;
          }
          .footer {
            padding: 18px 30px;
            background-color: #f8f9fa;
            border-top: 1px solid #eeeeee;
            font-size: 13px;
            color: #777777;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GlassStudio XML Sitemap</h1>
            <p>Generated for Google, Bing, and Search Engine Indexing</p>
          </div>
          <div class="content">
            <div class="stats">
              This XML sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> indexed URLs for <a href="https://glassstudio.in">https://glassstudio.in</a>.
            </div>
            <table>
              <thead>
                <tr>
                  <th width="55%">URL Location</th>
                  <th width="15%">Priority</th>
                  <th width="15%">Frequency</th>
                  <th width="15%">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <span class="priority-badge">
                        <xsl:value-of select="sitemap:priority"/>
                      </span>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
          <div class="footer">
            GlassStudio Door &amp; Partition &bull; Manikonda, Hyderabad &bull; <a href="https://glassstudio.in">glassstudio.in</a>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
