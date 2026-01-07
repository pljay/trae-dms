import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileContent = fs.readFileSync(resolve(__dirname, 'src/views/PackageRecordsView.vue'), 'utf-8');

// 定义表格列配置
const columnsDefinition = `
// 表格列配置
const columns = [
  {
    title: '${'运单号'}',
    key: 'trackNo',
    width: 120,
  },
  {
    title: '${'状态'}',
    key: 'status',
    width: 100,
  },
  {
    title: '${'渠道'}',
    key: 'channel',
    width: 100,
  },
  {
    title: '${'国家'}',
    key: 'country',
    width: 80,
  },
  {
    title: '${'重量'}',
    key: 'weight',
    width: 80,
  },
  {
    title: '${'尺寸'}',
    key: 'dimensions',
    width: 120,
  },
  {
    title: '${'创建时间'}',
    key: 'createdAt',
    width: 150,
  },
];
`;

// 替换表格部分
let updatedContent = fileContent.replace(
  /    <div class="table-section" ref="tableContainer">[\s\S]*?    <\/div>/,
  `    <div class="table-section">
      <var-card shadow="hover">
        <var-table :data="displayedPackages" :columns="columns" row-key="trackNo">
          <template #body="{ row }">
            <tr>
              <td>{{ row.trackNo }}</td>
              <td><var-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</var-tag></td>
              <td>{{ row.channel }}</td>
              <td>{{ row.country }}</td>
              <td>{{ row.weight.toFixed(2) }} kg</td>
              <td>{{ row.length }}x{{ row.width }}x{{ row.height }} cm</td>
              <td>{{ formatDate(row.createdAt) }}</td>
            </tr>
          </template>
        </var-table>
        
        <!-- 加载更多指示器 -->
        <div v-if="hasMore" class="loading-more">
          <var-loading type="circle"></var-loading>
          <span>{{ $t('common.loading') }}</span>
        </div>
        
        <!-- 没有更多数据 -->
        <div v-else-if="displayedPackages.length > 0" class="no-more">
          <span>{{ $t('common.noMoreData') }}</span>
        </div>
        
        <!-- 没有数据 -->
        <div v-else class="no-data">
          <span>{{ $t('common.noData') }}</span>
        </div>
      </var-card>
    </div>`
);

// 在 script 标签中添加 columns 定义
updatedContent = updatedContent.replace(
  /const batchSize = ref\(100\);\nconst activeTab = ref\('all'\);/,
  `const batchSize = ref(100);
const activeTab = ref('all');${columnsDefinition}`
);

fs.writeFileSync(resolve(__dirname, 'src/views/PackageRecordsView.vue'), updatedContent, 'utf-8');
console.log('文件已成功更新');
