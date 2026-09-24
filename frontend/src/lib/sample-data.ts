export interface SampleDataset {
  id: string;
  name: string;
  category: string;
  description: string;
  csvText: string;
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: "sales",
    name: "Quarterly Tech Sales",
    category: "Business",
    description: "Multi-category quarterly revenue and units sold",
    csvText: `Date,Category,Region,Revenue,Units_Sold
2024-01-15,Laptops,North America,45000.00,30
2024-01-15,Smartphones,North America,62000.50,85
2024-01-15,Monitors,North America,18500.00,45
2024-02-15,Laptops,Europe,38000.00,25
2024-02-15,Smartphones,Europe,54000.00,70
2024-02-15,Monitors,Europe,21000.00,50
2024-03-15,Laptops,Asia,52000.00,38
2024-03-15,Smartphones,Asia,78000.00,110
2024-03-15,Monitors,Asia,24500.00,58`
  },
  {
    id: "iris",
    name: "Iris Flower Metrics",
    category: "Science",
    description: "Classic statistical measurements for Sepal & Petal lengths",
    csvText: `sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
4.7,3.2,1.3,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
6.4,3.2,4.5,1.5,versicolor
6.9,3.1,4.9,1.5,versicolor
6.3,3.3,6.0,2.5,virginica
5.8,2.7,5.1,1.9,virginica
7.1,3.0,5.9,2.1,virginica`
  },
  {
    id: "temperatures",
    name: "Global Monthly Temps",
    category: "Climate",
    description: "Historical monthly average temperatures over 12 months",
    csvText: `Month,Year,London_Temp,NewYork_Temp,Tokyo_Temp
Jan,2024,6.2,1.5,5.4
Feb,2024,7.1,2.8,6.1
Mar,2024,9.5,6.4,9.8
Apr,2024,12.8,11.5,14.2
May,2024,16.2,16.8,18.5
Jun,2024,19.4,22.1,21.8
Jul,2024,22.1,25.4,25.6
Aug,2024,21.8,24.8,27.1
Sep,2024,18.2,20.5,23.2
Oct,2024,13.9,14.8,17.5
Nov,2024,9.4,8.9,12.1
Dec,2024,6.8,3.2,7.5`
  },
  {
    id: "salaries",
    name: "AI & Tech Salaries",
    category: "HR & Jobs",
    description: "Compensation & workforce benchmark across 14 metrics and 45 tech roles",
    csvText: `Employee_ID,Job_Title,Department,Experience_Level,Employment_Type,Base_Salary_USD,Bonus_USD,Stock_Options_USD,Total_Comp_USD,Remote_Ratio_Pct,Company_Location,Company_Size,Years_Experience,Performance_Rating
EMP-101,Data Scientist,Analytics,Senior,Full-Time,165000,20000,30000,215000,100,US,Enterprise,7,4.6
EMP-102,Machine Learning Engineer,AI Research,Senior,Full-Time,195000,25000,45000,265000,50,US,Enterprise,8,4.8
EMP-103,Frontend Architect,Engineering,Lead,Full-Time,175000,18000,25000,218000,100,UK,Large,10,4.5
EMP-104,Backend Engineer,Engineering,Mid,Full-Time,130000,10000,15000,155000,0,Germany,Medium,4,4.1
EMP-105,Data Analyst,Analytics,Junior,Full-Time,85000,5000,0,90000,50,US,Small,2,3.8
EMP-106,AI Research Scientist,AI Research,Senior,Full-Time,210000,35000,60000,305000,100,US,Enterprise,9,4.9
EMP-107,DevOps Engineer,Infrastructure,Mid,Full-Time,140000,12000,10000,162000,100,Canada,Medium,5,4.2
EMP-108,Full Stack Engineer,Engineering,Senior,Full-Time,160000,15000,20000,195000,50,US,Large,6,4.4
EMP-109,Security Lead,Security,Lead,Full-Time,185000,22000,35000,242000,0,US,Enterprise,11,4.7
EMP-110,Cloud Architect,Infrastructure,Lead,Full-Time,190000,24000,40000,254000,100,US,Enterprise,12,4.8
EMP-111,Product Manager,Product,Senior,Full-Time,155000,18000,25000,198000,50,UK,Large,7,4.3
EMP-112,Data Engineer,Analytics,Mid,Full-Time,135000,11000,12000,158000,100,US,Medium,4,4.0
EMP-113,MLOps Engineer,AI Research,Mid,Full-Time,148000,14000,18000,180000,100,US,Medium,5,4.3
EMP-114,Mobile Specialist,Engineering,Senior,Full-Time,152000,13000,15000,180000,50,Japan,Large,6,4.1
EMP-115,Systems Administrator,Infrastructure,Junior,Full-Time,78000,4000,0,82000,0,Germany,Small,1,3.5
EMP-116,AI Ethics Officer,AI Research,Senior,Full-Time,172000,19000,22000,213000,100,US,Enterprise,8,4.5
EMP-117,Site Reliability Eng,Infrastructure,Senior,Full-Time,168000,17000,24000,209000,100,Canada,Large,7,4.6
EMP-118,BI Developer,Analytics,Mid,Full-Time,115000,8000,5000,128000,50,US,Medium,3,3.9
EMP-119,Security Analyst,Security,Junior,Full-Time,92000,6000,2000,100000,0,US,Medium,2,3.7
EMP-120,VP of Engineering,Engineering,Executive,Full-Time,245000,50000,90000,385000,50,US,Enterprise,15,4.9
EMP-121,Principal Data Scientist,Analytics,Lead,Full-Time,205000,30000,55000,290000,100,US,Enterprise,11,4.9
EMP-122,NLP Researcher,AI Research,Mid,Full-Time,158000,16000,20000,194000,100,UK,Medium,4,4.4
EMP-123,Database Architect,Analytics,Senior,Full-Time,162000,15000,22000,199000,0,US,Large,8,4.3
EMP-124,Frontend Engineer,Engineering,Mid,Full-Time,124000,9000,8000,141000,100,Germany,Medium,3,4.0
EMP-125,QA Automation Eng,Engineering,Mid,Full-Time,112000,7000,5000,124000,50,Canada,Medium,4,3.9
EMP-126,Computer Vision Eng,AI Research,Senior,Full-Time,188000,23000,38000,249000,50,US,Enterprise,7,4.7
EMP-127,Scrum Master,Product,Mid,Full-Time,118000,8000,6000,132000,100,US,Medium,5,4.1
EMP-128,Technical Writer,Product,Junior,Full-Time,75000,3000,0,78000,100,US,Small,2,3.6
EMP-129,Infrastructure Lead,Infrastructure,Lead,Full-Time,182000,21000,32000,235000,0,US,Enterprise,10,4.6
EMP-130,Staff Backend Eng,Engineering,Senior,Full-Time,192000,26000,45000,263000,100,US,Enterprise,9,4.8
EMP-131,Data Viz Engineer,Analytics,Mid,Full-Time,128000,10000,9000,147000,100,Australia,Medium,4,4.2
EMP-132,Cybersecurity Lead,Security,Lead,Full-Time,189000,23000,36000,248000,50,US,Enterprise,11,4.7
EMP-133,Deep Learning Specialist,AI Research,Senior,Full-Time,202000,28000,50000,280000,100,US,Enterprise,8,4.8
EMP-134,Cloud Engineer,Infrastructure,Mid,Full-Time,136000,11000,12000,159000,50,Singapore,Medium,4,4.1
EMP-135,UI/UX Designer,Product,Senior,Full-Time,142000,12000,15000,169000,100,UK,Large,6,4.3
EMP-136,Embedded Systems Eng,Engineering,Senior,Full-Time,156000,14000,18000,188000,0,Japan,Large,7,4.2
EMP-137,Quantitative Analyst,Analytics,Senior,Full-Time,198000,32000,48000,278000,0,US,Enterprise,8,4.7
EMP-138,Growth Marketer,Product,Mid,Full-Time,108000,9000,4000,121000,100,US,Small,3,3.8
EMP-139,Solutions Architect,Engineering,Lead,Full-Time,186000,22000,34000,242000,50,US,Enterprise,10,4.6
EMP-140,Network Engineer,Infrastructure,Mid,Full-Time,119000,8000,6000,133000,0,Germany,Medium,4,4.0
EMP-141,AI Product Manager,Product,Senior,Full-Time,178000,21000,30000,229000,100,US,Enterprise,7,4.6
EMP-142,Data Governance Lead,Analytics,Lead,Full-Time,165000,17000,22000,204000,50,US,Large,9,4.4
EMP-143,Platform Engineer,Infrastructure,Senior,Full-Time,164000,16000,21000,201000,100,Canada,Large,6,4.5
EMP-144,AppSec Specialist,Security,Mid,Full-Time,144000,13000,14000,171000,100,US,Medium,5,4.2
EMP-145,Chief AI Officer,AI Research,Executive,Full-Time,260000,60000,120000,440000,100,US,Enterprise,16,5.0`
  },
  {
    id: "saas_churn",
    name: "SaaS MRR & Churn",
    category: "Analytics",
    description: "Monthly recurring revenue, churn risk score, and plan tiers",
    csvText: `Customer_ID,Plan_Tier,Monthly_MRR,Support_Tickets,Churn_Risk_Score
CUST-001,Enterprise,4500,2,0.12
CUST-002,Pro,299,8,0.78
CUST-003,Starter,49,1,0.05
CUST-004,Enterprise,6200,0,0.02
CUST-005,Pro,499,6,0.65
CUST-006,Starter,49,4,0.45
CUST-007,Pro,299,1,0.10
CUST-008,Enterprise,8500,12,0.82`
  },
  {
    id: "stocks",
    name: "Tech Stock Volatility",
    category: "Finance",
    description: "Daily trading close prices and volume for top tech stocks",
    csvText: `Date,Symbol,Close_Price,Volume_Millions,Daily_Return_Pct
2024-01-02,AAPL,185.64,52.4,0.85
2024-01-02,NVDA,481.68,41.2,3.12
2024-01-02,MSFT,370.87,24.1,1.15
2024-01-03,AAPL,184.25,48.9,-0.75
2024-01-03,NVDA,475.69,38.5,-1.24
2024-01-03,MSFT,368.42,22.8,-0.66
2024-01-04,AAPL,181.91,61.3,-1.27
2024-01-04,NVDA,490.97,55.1,3.21
2024-01-04,MSFT,367.94,20.9,-0.13`
  },
  {
    id: "customer_segments",
    name: "Customer Segmentation",
    category: "Marketing",
    description: "Demographics, annual income, spending score, and cluster segment",
    csvText: `Customer_ID,Age,Annual_Income_kUSD,Spending_Score_1to100,Segment
CUST_101,19,15,39,Budget
CUST_102,21,15,81,High Spender
CUST_103,20,16,6,Saver
CUST_104,23,16,77,High Spender
CUST_105,31,17,40,Budget
CUST_106,22,17,76,High Spender
CUST_107,35,18,6,Saver
CUST_108,23,18,94,High Spender`
  },
  {
    id: "ml_benchmarks",
    name: "ML Model Benchmarks",
    category: "AI / ML",
    description: "Training loss, validation accuracy, and inference latency by epoch",
    csvText: `Epoch,Architecture,Train_Loss,Val_Accuracy_Pct,Latency_ms
1,Transformer-Base,1.85,62.4,14.2
5,Transformer-Base,0.64,84.1,14.5
10,Transformer-Base,0.22,91.8,14.1
1,ResNet-50,2.10,55.1,8.4
5,ResNet-50,0.85,78.6,8.5
10,ResNet-50,0.38,87.2,8.3
1,Mamba-StateSpace,1.92,59.8,5.1
5,Mamba-StateSpace,0.58,86.4,5.2
10,Mamba-StateSpace,0.18,93.5,5.0`
  }
];
