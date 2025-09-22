<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive AI Data Science Tutor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.plot.ly/plotly-2.32.0.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
        }
        .main-container {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 1.5rem;
            background-color: white;
            border-radius: 1rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .tutor-message {
            display: flex;
            align-items: flex-start;
            margin-bottom: 1.5rem;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeIn 0.5s ease-out forwards;
        }
        .tutor-message .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #4f46e5;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 1rem;
            flex-shrink: 0;
        }
        .tutor-message .content {
            background-color: #eef2ff;
            padding: 1rem;
            border-radius: 0.5rem;
            border-top-left-radius: 0;
            flex-grow: 1;
        }
        .code-block {
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
            position: relative;
            margin-top: 1rem;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background-color: #334155;
            color: #94a3b8;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 0.75rem;
        }
        .btn {
            background-color: #4f46e5;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #4338ca;
        }
        .nav-btn {
            background-color: #eef2ff;
            color: #4338ca;
            border: 1px solid #c7d2fe;
        }
        .nav-btn.active {
            background-color: #4f46e5;
            color: white;
            font-weight: 700;
        }
        .concept-card, .key-concept-item {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-top: 1.5rem;
        }
        .key-concept-item {
            padding: 1.5rem;
            margin-top: 1rem;
        }
        .quiz-option {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.75rem 1rem;
            margin-top: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            transition: background-color 0.2s, border-color 0.2s;
        }
        .quiz-option:hover {
            background-color: #f0f2f5;
            border-color: #4f46e5;
        }
        .quiz-option.correct {
            background-color: #dcfce7;
            border-color: #22c55e;
        }
        .quiz-option.incorrect {
            background-color: #fee2e2;
            border-color: #ef4444;
        }
        .llm-interaction {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
        }
        .llm-response {
            background-color: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            border: 1px solid #e2e8f0;
        }
        input[type="text"] {
             width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
        }

        @keyframes fadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>

    <div class="main-container">
        <h1 class="text-3xl font-bold text-center mb-2 text-gray-800">Comprehensive AI Data Science Tutor</h1>
        <p class="text-center text-gray-500 mb-6">Your interactive guide to mastering data science.</p>

        <!-- Navigation -->
        <div class="flex justify-center flex-wrap gap-2 border-b-2 pb-4 mb-6">
            <button id="nav-course" class="btn nav-btn active" onclick="showSection('course')">📚 Course Content</button>
            <button id="nav-concepts" class="btn nav-btn" onclick="showSection('concepts')">🔑 Key Concepts</button>
            <button id="nav-analytics" class="btn nav-btn" onclick="showSection('analytics')">🔬 Live Analytics</button>
            <button id="nav-quiz" class="btn nav-btn" onclick="showSection('quiz')">🧠 Knowledge Check</button>
        </div>

        <!-- Section: Course Content -->
        <div id="section-course">
            <h2 class="text-2xl font-bold text-gray-700">Explore Core Concepts</h2>
            <p class="text-gray-600 mt-1">Select a topic to learn interactively with explanations, synthetic data visualizations, and code examples.</p>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button class="btn w-full" onclick="renderCourseContent('ds_foundations')">Data Science Foundations</button>
                <button class="btn w-full" onclick="renderCourseContent('stats_foundations')">Statistics Foundations</button>
                <button class="btn w-full" onclick="renderCourseContent('viz_foundations')">Data Visualization</button>
                <button class="btn w-full" onclick="renderCourseContent('pandas_wrangling')">Pandas Data Wrangling</button>
            </div>
            <div id="course-content-area" class="mt-4"></div>
        </div>
        
        <!-- Section: Key Concepts -->
        <div id="section-concepts" class="hidden">
            <h2 class="text-2xl font-bold text-gray-700">Expert-Curated Key Concepts</h2>
            <p class="text-gray-600 mt-1">Explore lists of key data science concepts curated by experts. Select a concept to begin a mini-lesson.</p>
            <div class="mt-4 flex justify-center gap-4">
                 <select id="key-concept-select" class="p-2 border rounded-md">
                    <option value="">-- Select a Key Concept --</option>
                 </select>
            </div>
            <div id="key-concepts-area" class="mt-4"></div>
        </div>

        <!-- Section: Live Analytics -->
        <div id="section-analytics" class="hidden">
            <div id="analytics-flow">
                <!-- Live Analytics chat will be injected here -->
            </div>
        </div>

        <!-- Section: Quiz -->
        <div id="section-quiz" class="hidden">
             <h2 class="text-2xl font-bold text-gray-700">Test Your Knowledge</h2>
             <p class="text-gray-600 mt-1">Answer these questions to see how much you've learned. Good luck!</p>
             <div id="quiz-area" class="mt-6">
                <!-- Quiz will be injected here -->
             </div>
             <div id="quiz-results" class="hidden mt-6 text-center"></div>
             <div id="quiz-references" class="hidden mt-8">
                <h3 class="text-xl font-bold">Further Reading & Exploration</h3>
                <ul class="list-disc list-inside mt-2 text-blue-600">
                    <li><a href="https://pandas.pydata.org/docs/" target="_blank" class="hover:underline">Pandas Official Documentation</a></li>
                    <li><a href="https://seaborn.pydata.org/" target="_blank" class="hover:underline">Seaborn Official Documentation</a></li>
                    <li><a href="https://plotly.com/python/" target="_blank" class="hover:underline">Plotly Python Library</a></li>
                    <li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank" class="hover:underline">Khan Academy - Statistics and Probability</a></li>
                </ul>
             </div>
        </div>

    </div>

    <script>
        // --- App State & Navigation ---
        let currentSection = 'course';

        function showSection(section) {
            currentSection = section;
            document.getElementById('section-course').classList.add('hidden');
            document.getElementById('section-analytics').classList.add('hidden');
            document.getElementById('section-quiz').classList.add('hidden');
            document.getElementById('section-concepts').classList.add('hidden');
            
            document.getElementById('nav-course').classList.remove('active');
            document.getElementById('nav-analytics').classList.remove('active');
            document.getElementById('nav-quiz').classList.remove('active');
            document.getElementById('nav-concepts').classList.remove('active');
            
            document.getElementById(`section-${section}`).classList.remove('hidden');
            document.getElementById(`nav-${section}`).classList.add('active');
            
            if (section === 'concepts' && document.getElementById('key-concept-select').options.length === 1) {
                populateKeyConceptsDropdown();
            }
            if (section === 'analytics' && document.getElementById('analytics-flow').innerHTML === '') {
                startAnalyticsWorkflow();
            }
            if (section === 'quiz' && document.getElementById('quiz-area').innerHTML === '') {
                startQuiz();
            }
        }

        // --- SECTION 1: COURSE CONTENT ---

        const courseData = {
            ds_foundations: {
                title: "Data Science Foundations: The Life Cycle",
                concepts: [
                    {
                        name: "1. Business Understanding",
                        explanation: "This is the crucial first step. Before writing any code, you must understand the problem you're trying to solve from a business perspective. What are the objectives? What defines success?",
                        example: "<strong>Scenario:</strong> A telecom company wants to reduce customer churn (customers leaving).<br><strong>Objective:</strong> Identify customers at high risk of churning in the next month so the marketing team can offer them incentives.",
                        interaction: true
                    },
                    {
                        name: "2. Data Understanding",
                        explanation: "Once you know the problem, you need to find and explore the relevant data. This involves gathering data from various sources and performing initial Exploratory Data Analysis (EDA) to see what you have.",
                        example: "<strong>Data Sources:</strong> Customer demographic data (age, location), usage data (monthly bill, data usage), and customer service interaction logs.<br><strong>EDA Questions:</strong> Do customers with higher monthly bills churn more? Is there a correlation between customer service calls and churn?",
                        interaction: true
                    },
                    {
                        name: "3. Data Preparation",
                        explanation: "Real-world data is messy. This stage, often the most time-consuming, involves cleaning the data to make it suitable for modeling. This includes handling missing values, correcting errors, and transforming variables.",
                        example: "<strong>Task:</strong> The 'monthly bill' column has missing values. <br><strong>Action:</strong> You might fill them with the average monthly bill (mean imputation). You also discover a 'gender' column with values like 'M', 'F', and 'Male', which you standardize to 'Male' and 'Female'.",
                        interaction: true
                    },
                     {
                        name: "4. Modeling",
                        explanation: "This is where machine learning algorithms come into play. You select and train models that can find patterns in your prepared data to make predictions.",
                        example: "<strong>Algorithm Choice:</strong> You choose a classification algorithm like Logistic Regression or a Random Forest to predict a binary outcome: 'Churn' or 'No Churn'.<br><strong>Process:</strong> You split your data into a training set (to teach the model) and a testing set (to evaluate it).",
                        interaction: true
                    },
                     {
                        name: "5. Evaluation",
                        explanation: "How good is your model? In this stage, you evaluate the model's performance using various metrics to see if it meets the business objective.",
                        example: "<strong>Metrics:</strong> You use an Accuracy score to see what percentage of customers it correctly predicts. You also use a Confusion Matrix to understand what types of errors it's making (e.g., predicting a customer will stay when they actually churn).",
                        interaction: true
                    },
                     {
                        name: "6. Deployment",
                        explanation: "The final step is to put your model into a live environment where it can provide value. This could be integrating it into a company dashboard or an app.",
                        example: "<strong>Implementation:</strong> The model is run monthly on all current customer data. A list of high-risk customers is automatically sent to the marketing team's CRM system, triggering a retention campaign.",
                        interaction: true
                    }
                ]
            },
            stats_foundations: {
                title: "Statistics Foundations",
                concepts: [
                    {
                        name: "Measures of Central Tendency",
                        sub_topic: "Mean, Median, and Mode",
                        explanation: "These describe the center of a dataset. <strong>Mean</strong> is the average. <strong>Median</strong> is the middle value. <strong>Mode</strong> is the most frequent value.",
                        syntheticData: { x: [1, 2, 2, 3, 4, 5, 5, 5, 6, 7, 15] },
                        viz: 'histogram',
                        code: `
import numpy as np
data = [1, 2, 2, 3, 4, 5, 5, 5, 6, 7, 15]
mean = np.mean(data) # -> 5.0
median = np.median(data) # -> 5.0
# Mode requires scipy
from scipy import stats
mode = stats.mode(data, keepdims=True).mode[0] # -> 5`
                    },
                    {
                        name: "Measures of Dispersion",
                        sub_topic: "Standard Deviation & Variance",
                        explanation: "These measure data spread. <strong>Variance</strong> is the average of squared differences from the Mean. <strong>Standard Deviation</strong> is its square root, measuring spread in original units.",
                        syntheticData: { x: [-10, 0, 10, 20, 30], y: [8, 9, 10, 11, 12] },
                        viz: 'box',
                        code: `
import numpy as np
data1 = [-10, 0, 10, 20, 30] # High variance
data2 = [8, 9, 10, 11, 12] # Low variance
std1 = np.std(data1) # -> 14.14
std2 = np.std(data2) # -> 1.41`
                    },
                    {
                        name: "Types of Analysis",
                        sub_topic: "Univariate, Bivariate, Multivariate",
                        explanation: "Analysis is categorized by the number of variables examined at once.<br>• <strong>Univariate:</strong> Analyzing one variable (e.g., the distribution of 'Age').<br>• <strong>Bivariate:</strong> Analyzing the relationship between two variables (e.g., 'Age' vs. 'Salary').<br>• <strong>Multivariate:</strong> Analyzing three or more variables (e.g., how 'Age', 'Education', and 'Location' together impact 'Salary').",
                        example: "<strong>Example:</strong> A histogram of customer ages is <strong>univariate</strong>. A scatter plot of monthly bill vs. data usage is <strong>bivariate</strong>. A correlation heatmap showing relationships between all numerical features is <strong>multivariate</strong>."
                    }
                ]
            },
            viz_foundations: {
                title: "Data Visualization",
                concepts: [
                    {
                        name: "Histogram",
                        sub_topic: "For distributions (Univariate)",
                        explanation: "Shows the frequency distribution of a single numerical variable. It's key for understanding the shape of your data.",
                        syntheticData: { x: Array.from({length: 100}, () => Math.random() * 50 + 25) },
                        viz: 'histogram',
                        code: `
# sns.histplot(data=df, x='age', kde=True)`
                    },
                    {
                        name: "Bar Chart",
                        sub_topic: "For comparing categories",
                        explanation: "Compares a numerical value across different categories. The length of the bar represents the value.",
                        syntheticData: { x: ['New York', 'London', 'Tokyo'], y: [8.4, 9.0, 14.0] },
                        viz: 'bar',
                        code: `
# sns.barplot(data=sales_df, x='city', y='sales_in_millions')`
                    },
                    {
                        name: "Scatter Plot",
                        sub_topic: "For relationships (Bivariate)",
                        explanation: "Visualizes the relationship between two numerical variables to spot correlations.",
                        syntheticData: { x: [1, 2, 3, 4, 5, 6], y: [2, 3.5, 3.8, 5, 6.1, 7] },
                        viz: 'scatter',
                        code: `
# sns.scatterplot(data=df, x='engine_horsepower', y='price')`
                    },
                     {
                        name: "Box Plot",
                        sub_topic: "For summarizing distributions",
                        explanation: "Displays the five-number summary of a set of data: minimum, first quartile, median, third quartile, and maximum. Excellent for spotting outliers.",
                        syntheticData: { x: [-10, 0, 10, 20, 30], y: [8, 9, 10, 11, 12] },
                        viz: 'box',
                        code: `
# sns.boxplot(data=df, x='category', y='value')`
                    },
                    {
                        name: "Heatmap",
                        sub_topic: "For correlations (Multivariate)",
                        explanation: "A graphical representation of data where values are depicted by color. Often used to visualize correlation matrices.",
                        viz: 'heatmap',
                        code: `
# corr_matrix = df.corr()
# sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')`
                    }
                ]
            },
            pandas_wrangling: {
                 title: "Pandas Data Wrangling",
                 concepts: [
                    {
                        name: "Core Components",
                        sub_topic: "DataFrame & Series",
                        explanation: "A <strong>DataFrame</strong> is a 2D table, like a spreadsheet. A <strong>Series</strong> is a single column.",
                        code: `
import pandas as pd
data = {'Name': ['Alice', 'Bob'], 'Age': [25, 30]}
df = pd.DataFrame(data)
ages_series = df['Age'] # This is a Series`
                    },
                    {
                        name: "Selecting Data",
                        sub_topic: "Filtering with Conditions",
                        explanation: "Select subsets of data based on conditions. This is fundamental for isolating data of interest.",
                        example: "<strong>Step 1: Define condition:</strong> `df['Age'] > 28`<br><strong>Step 2: Apply condition to DataFrame:</strong> `df[df['Age'] > 28]`",
                        code: `
# Select all rows where Age is greater than 28
older_people = df[df['Age'] > 28]`
                    },
                     {
                        name: "Aggregating Data",
                        sub_topic: "Grouping with .groupby()",
                        explanation: "'group by' involves splitting data into groups, applying a function (like mean, sum) to each group, and combining the results.",
                        example: "<strong>Goal:</strong> Find the average salary per department.<br><strong>Step 1: Group by 'Department':</strong> `df.groupby('Department')`<br><strong>Step 2: Select 'Salary' column:</strong> `df.groupby('Department')['Salary']`<br><strong>Step 3: Apply mean function:</strong> `df.groupby('Department')['Salary'].mean()`",
                        code: `
# Assume df has 'Department' and 'Salary' columns
# avg_salary_by_dept = df.groupby('Department')['Salary'].mean()`
                    },
                    {
                        name: "Cleaning Data",
                        sub_topic: "Handling Missing Values",
                        explanation: "Decide how to handle empty or null (NaN) values.<br>• <strong>.dropna():</strong> Removes rows or columns with missing values.<br>• <strong>.fillna(value):</strong> Fills missing values with a specified value (e.g., the column's mean or median).",
                        code: `
# df has a column 'Score' with missing values
# Option 1: Drop rows with any missing values
df_cleaned = df.dropna()
# Option 2: Fill missing scores with the average score
mean_score = df['Score'].mean()
df_filled = df.fillna({'Score': mean_score})`
                    },
                    {
                        name: "Transforming Data",
                        sub_topic: "Creating New Columns",
                        explanation: "Create new features (columns) from existing data to aid analysis and modeling.",
                        example: "<strong>Goal:</strong> Create a 'Price per SqFt' column from 'Price' and 'SquareFeet' columns.<br><strong>Action:</strong> `df['Price_per_SqFt'] = df['Price'] / df['SquareFeet']`",
                        code: `
# Assume df has 'Price' and 'Tax' columns
df['Price_With_Tax'] = df['Price'] * (1 + df['Tax'])`
                    }
                 ]
            }
        };

        function renderCourseContent(topicKey) {
            const content = courseData[topicKey];
            const area = document.getElementById('course-content-area');
            area.innerHTML = `<h3 class="text-xl font-bold text-indigo-700">${content.title}</h3>`;

            content.concepts.forEach((concept, index) => {
                const card = document.createElement('div');
                card.className = 'concept-card';
                const plotId = `plot-${topicKey}-${index}`;
                const interactionId = `interaction-${topicKey}-${index}`;
                
                let vizHtml = '';
                if (concept.viz) {
                    vizHtml = `<div id="${plotId}" class="mt-4 min-h-[300px]"></div>`;
                }

                let codeHtml = '';
                if (concept.code) {
                    codeHtml = generateCodeBlock(concept.code);
                }
                
                let exampleHtml = '';
                if(concept.example) {
                    exampleHtml = `<div class="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md"><p class="text-gray-700">${concept.example}</p></div>`;
                }
                
                let interactionHtml = '';
                if (concept.interaction) {
                    interactionHtml = `
                        <div class="llm-interaction">
                            <label class="font-semibold text-gray-700">Have a question? Ask the AI!</label>
                             <div class="flex mt-2 space-x-2">
                                <input type="text" id="input-${interactionId}" placeholder="e.g., What is EDA?" class="flex-grow">
                                <button class="btn" onclick="handleLlmQuery('${interactionId}', '${concept.name}')">Ask</button>
                            </div>
                            <div id="response-${interactionId}" class="hidden llm-response"></div>
                        </div>
                    `;
                }

                const titleHtml = concept.sub_topic ? `<h4 class="text-lg font-semibold">${concept.name} <span class="text-base font-normal text-gray-500">- ${concept.sub_topic}</span></h4>` : `<h4 class="text-lg font-semibold">${concept.name}</h4>`;

                card.innerHTML = `
                    ${titleHtml}
                    <p class="text-gray-600 mt-2">${concept.explanation}</p>
                    ${exampleHtml}
                    ${vizHtml}
                    ${codeHtml}
                    ${interactionHtml}
                `;
                area.appendChild(card);

                if (concept.viz && concept.syntheticData) {
                    let plotData, layout;
                    switch(concept.viz) {
                        case 'histogram':
                            plotData = [{ ...concept.syntheticData, type: 'histogram', marker: { color: '#4f46e5' } }];
                            layout = { title: `Example: ${concept.name}`, xaxis: {title: 'Value'}, yaxis: {title: 'Frequency'} };
                            break;
                        case 'scatter':
                            plotData = [{ ...concept.syntheticData, mode: 'markers', type: 'scatter', marker: { color: '#4f46e5' } }];
                            layout = { title: `Example: ${concept.name}`, xaxis: {title: 'Variable X'}, yaxis: {title: 'Variable Y'} };
                            break;
                        case 'box':
                            plotData = [
                                { y: concept.syntheticData.x, type: 'box', name: 'High Spread' },
                                { y: concept.syntheticData.y, type: 'box', name: 'Low Spread' }
                            ];
                            layout = { title: 'Comparing Data Spread' };
                            break;
                        case 'bar':
                            plotData = [{ ...concept.syntheticData, type: 'bar', marker: { color: '#4f46e5' } }];
                            layout = { title: 'Population in Millions', xaxis: {title: 'City'}, yaxis: {title: 'Population (M)'} };
                            break;
                        case 'heatmap':
                             plotData = [{ z: [[1, 0.2, -0.5], [0.2, 1, 0.8], [-0.5, 0.8, 1]], x: ['Feat A', 'Feat B', 'Feat C'], y: ['Feat A', 'Feat B', 'Feat C'], type: 'heatmap', colorscale: 'RdBu', zmin: -1, zmax: 1 }];
                             layout = {title: 'Example Correlation Matrix'};
                             break;
                    }
                    if(plotData) Plotly.newPlot(plotId, plotData, layout, {responsive: true});
                }
            });
        }
        
        async function handleLlmQuery(interactionId, conceptName) {
            const input = document.getElementById(`input-${interactionId}`);
            const responseDiv = document.getElementById(`response-${interactionId}`);
            const question = input.value;
            if (!question.trim()) return;

            responseDiv.classList.remove('hidden');
            responseDiv.innerHTML = '🤖 Thinking...';

            await new Promise(r => setTimeout(r, 1500)); 
            
            let response = `In the context of **${conceptName}**, your question about "${question}" is excellent. `;
            if (conceptName.includes("Business Understanding")) {
                response += "A common follow-up is to define Key Performance Indicators (KPIs). For the churn example, a KPI would be reducing the churn rate by 5% in the next quarter.";
            } else if (conceptName.includes("Data Preparation")) {
                 response += "Handling missing data is critical. Besides mean imputation, for categorical data, you might use the mode (most frequent value). For time series, you might use forward-fill or back-fill.";
            } else if (conceptName.includes("Modeling")) {
                 response += "Model selection depends on the problem. For predicting a number (e.g., house price), you'd use regression models like Linear Regression. For classification (e.g., churn), you use models like Logistic Regression or Decision Trees.";
            } else {
                response += "This is a key part of the process where a data scientist's expertise truly shines. It involves asking 'why' and connecting the data back to the initial business problem.";
            }
            
            responseDiv.innerHTML = response;
            input.value = '';
        }

        // --- SECTION 2: KEY CONCEPTS ---
        const keyConceptsList = {
            'Correlation': {
                category: 'Statistics',
                introQuestions: ["Have you ever wondered if two things are related, like ice cream sales and temperature?", "How can we measure the strength and direction of a relationship between two variables numerically?"],
                explanation: "Correlation is a statistical measure that expresses the extent to which two variables are linearly related, meaning they change together at a constant rate. It's measured by the correlation coefficient, which ranges from -1 to +1. A value of +1 implies a perfect positive relationship, -1 implies a perfect negative relationship, and 0 implies no linear relationship.",
                syntheticData: { x: [10, 20, 30, 40, 50], y: [15, 25, 38, 45, 55] },
                viz: 'scatter',
                code: `
# For a scatter plot to see the relationship:
import seaborn as sns
# sns.scatterplot(data=df, x='temperature', y='ice_cream_sales')

# To calculate the correlation coefficient:
# correlation = df['temperature'].corr(df['ice_cream_sales'])`,
                furtherQuestions: ["What's the difference between correlation and causation?", "How would the scatter plot look for a strong negative correlation?", "Can we calculate correlation for non-numerical data?"]
            },
            'Classification': {
                category: 'Machine Learning',
                introQuestions: ["How does your email provider automatically know which emails are spam?", "If you have data about customers, how could you predict which ones are likely to buy a product?"],
                explanation: "Classification is a type of supervised machine learning where the goal is to predict a categorical class label. The algorithm learns from a labeled dataset (e.g., emails labeled as 'spam' or 'not spam') and then assigns a class to new, unlabeled data.",
                syntheticData: { x: ['Spam', 'Not Spam'], y: [150, 850] },
                viz: 'bar',
                code: `
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# X = features, y = labels ('spam'/'not spam')
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# model = RandomForestClassifier()
# model.fit(X_train, y_train)

# predictions = model.predict(X_test)
# print(f'Accuracy: {accuracy_score(y_test, predictions)}')`,
                furtherQuestions: ["What are some other real-world examples of classification?", "What is an 'accuracy score' and is it always the best way to measure a model's performance?", "What's the difference between binary classification and multi-class classification?"]
            },
            'Handling Missing Values': {
                category: 'Data Wrangling',
                introQuestions: ["What should you do if some of the cells in your spreadsheet are empty?", "Can you simply ignore or delete data that's missing?"],
                explanation: "Real-world data is often incomplete. Handling missing values (often represented as NaN) is a critical data cleaning step. Common strategies include removing rows/columns with missing data (.dropna()) or filling them with a meaningful value (.fillna()), such as the mean, median, or mode of the column.",
                syntheticData: { x: ['With Value', 'Missing'], y: [800, 200] },
                viz: 'bar',
                code: `
import pandas as pd
import numpy as np

# df has a column 'Score' with missing values
# Option 1: Drop rows with any missing values
# df_cleaned = df.dropna()

# Option 2: Fill missing scores with the average score
# mean_score = df['Score'].mean()
# df_filled = df.fillna({'Score': mean_score})`,
                furtherQuestions: ["When is it a good idea to drop missing data versus filling it?", "What are more advanced methods for imputing missing values?", "How can missing values introduce bias into your analysis?"]
            }
            // More concepts would be added here in the same detailed format.
        };

        function populateKeyConceptsDropdown() {
            const select = document.getElementById('key-concept-select');
            if (select.options.length > 1) return; // Already populated
            
            Object.keys(keyConceptsList).forEach(conceptName => {
                const option = document.createElement('option');
                option.value = conceptName;
                option.textContent = conceptName;
                select.appendChild(option);
            });
            select.addEventListener('change', (event) => {
                renderKeyConcept(event.target.value);
            });
        }
        
        function renderKeyConcept(conceptName) {
            const area = document.getElementById('key-concepts-area');
            if (!conceptName) {
                area.innerHTML = '';
                return;
            }

            const concept = keyConceptsList[conceptName];
            const plotId = `plot-key-concept-${conceptName.replace(/\s+/g, '-')}`;

            let vizHtml = '';
            if (concept.viz) {
                vizHtml = `<div id="${plotId}" class="mt-4 min-h-[350px] border rounded-lg p-2"></div>`;
            }

            let codeHtml = '';
            if (concept.code) {
                codeHtml = generateCodeBlock(concept.code);
            }
            
            const introQuestionsHtml = concept.introQuestions.map(q => `<li class="italic text-gray-600">${q}</li>`).join('');
            const furtherQuestionsHtml = concept.furtherQuestions.map(q => `<li class="text-indigo-700">${q}</li>`).join('');

            const cardHtml = `
                <div class="key-concept-item">
                    <h3 class="text-2xl font-bold text-gray-800">${concept.name}</h3>
                    <p class="text-sm font-semibold text-indigo-600 bg-indigo-100 inline-block px-2 py-1 rounded-full mt-1">${concept.category}</p>
                    
                    <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 class="font-semibold">Let's think about this...</h4>
                        <ul class="list-disc list-inside mt-2 space-y-1">
                           ${introQuestionsHtml}
                        </ul>
                    </div>
                    
                    <h4 class="font-semibold mt-6">Concept Explained</h4>
                    <p class="text-gray-700 mt-2">${concept.explanation}</p>
                    
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h4 class="font-semibold">Example with Code</h4>
                            ${codeHtml}
                        </div>
                        <div>
                             <h4 class="font-semibold">Sample Visualization</h4>
                            ${vizHtml}
                        </div>
                    </div>

                    <div class="mt-8 p-4 bg-indigo-50 rounded-lg">
                         <h4 class="font-semibold">Questions for Further Exploration</h4>
                         <ul class="list-disc list-inside mt-2 space-y-1">
                            ${furtherQuestionsHtml}
                         </ul>
                    </div>
                </div>
            `;
            
            area.innerHTML = cardHtml;
            
            if (concept.viz && concept.syntheticData) {
                let plotData, layout;
                switch(concept.viz) {
                     case 'scatter':
                        plotData = [{ ...concept.syntheticData, mode: 'markers', type: 'scatter', marker: { color: '#4f46e5', size: 10 } }];
                        layout = { title: `Relationship Example`, xaxis: {title: 'Variable X'}, yaxis: {title: 'Variable Y'} };
                        break;
                    case 'bar':
                        plotData = [{ ...concept.syntheticData, type: 'bar', marker: { color: ['#ef4444', '#22c55e'] } }];
                        layout = { title: 'Classification Counts Example', xaxis: {title: 'Predicted Class'}, yaxis: {title: 'Count'} };
                        break;
                }
                 if(plotData) Plotly.newPlot(plotId, plotData, layout, {responsive: true});
            }
        }


        // --- SECTION 3: LIVE ANALYTICS ---
        const analyticsState = {
            currentStep: 0, fileName: null, headers: [], data: [],
        };
        const analyticsFlow = document.getElementById('analytics-flow');

        async function startAnalyticsWorkflow() {
            analyticsState.currentStep = 0;
            analyticsFlow.innerHTML = '';
            await renderAnalyticsStep();
        }

        async function renderAnalyticsStep() {
            switch(analyticsState.currentStep) {
                case 0:
                    await addAnalyticsMessage(`
                        <p class="font-semibold">Welcome to the Live Analytics Playground!</p>
                        <p class="mt-2 text-gray-600">This is where you can upload your own CSV data and perform a guided analysis.</p>
                        <p class="mt-4 font-semibold">Let's start by uploading a dataset.</p>
                        <div class="user-action mt-4">
                            <input type="file" id="csv-upload-live" accept=".csv" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        </div>
                    `, false);
                    document.getElementById('csv-upload-live').addEventListener('change', handleLiveFileUpload);
                    break;
                 case 1: // EDA Section
                    await addAnalyticsMessage(`
                        <p class="font-semibold">Successfully loaded "${analyticsState.fileName}". Let's start Exploratory Data Analysis (EDA).</p>
                        <p class="mt-4 font-semibold">What would you like to do first?</p>
                        <div class="user-action mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button class="btn" onclick="runLiveAnalysis('summary')">Get Data Summary</button>
                            <button class="btn" onclick="runLiveAnalysis('distribution')">Analyze Distribution</button>
                            <button class="btn" onclick="runLiveAnalysis('relationship')">Explore Relationship</button>
                            <button class="btn" onclick="runLiveAnalysis('correlation')">View Correlation</button>
                        </div>`);
                    break;
            }
        }
        
        async function addAnalyticsMessage(html, showLoader = true) {
             const messageId = `analytics-msg-${Date.now()}`;
            let wrapper = document.createElement('div');
            wrapper.className = 'tutor-message';
            wrapper.innerHTML = `<div class="avatar">AI</div><div class="content" id="${messageId}">${showLoader ? '...' : html}</div>`;
            analyticsFlow.appendChild(wrapper);
            if(showLoader) {
                await new Promise(r => setTimeout(r, 800));
                const msgDiv = document.getElementById(messageId);
                if (msgDiv) msgDiv.innerHTML = html;
            }
        }

        function handleLiveFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            analyticsState.fileName = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.split('\n').filter(row => row.trim() !== '');
                analyticsState.headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
                analyticsState.data = rows.slice(1).map(row => {
                    const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    let obj = {};
                    analyticsState.headers.forEach((header, i) => {
                        const value = values[i] ? values[i].trim().replace(/"/g, '') : '';
                        obj[header] = isNaN(value) || value === '' ? value : parseFloat(value);
                    });
                    return obj;
                });
                analyticsState.currentStep = 1;
                renderAnalyticsStep();
            };
            reader.readAsText(file);
        }
        
        async function runLiveAnalysis(type) {
            await addAnalyticsMessage(`<p>Generating ${type} analysis...</p>`);
            // Placeholder for brevity. Full implementation would go here.
             await addAnalyticsMessage(`
                <p class="font-semibold">Analysis complete! Here's where the chart and code for '${type}' would appear.</p>
                 <p class="mt-4 font-semibold">What would you like to do next?</p>
                 <div class="user-action mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button class="btn" onclick="runLiveAnalysis('summary')">Get Data Summary</button>
                    <button class="btn" onclick="runLiveAnalysis('distribution')">Analyze Distribution</button>
                    <button class="btn" onclick="runLiveAnalysis('relationship')">Explore Relationship</button>
                    <button class="btn" onclick="runLiveAnalysis('correlation')">View Correlation</button>
                 </div>
            `);
        }

        // --- SECTION 4: QUIZ ---
        const quizQuestions = [
            { question: "Which of the following is NOT a measure of central tendency?", options: ["Mean", "Median", "Standard Deviation", "Mode"], answer: "Standard Deviation", explanation: "Standard Deviation measures the spread or dispersion of data, not its central point." },
            { question: "What type of chart is best for visualizing the relationship between two numerical variables?", options: ["Histogram", "Bar Chart", "Pie Chart", "Scatter Plot"], answer: "Scatter Plot", explanation: "A scatter plot is specifically designed to show how two numerical variables are related to each other." },
            { question: "In Pandas, what is a single column of a DataFrame called?", options: ["A List", "A Series", "An Array", "A Column"], answer: "A Series", explanation: "A Pandas DataFrame is composed of one or more Series." },
            { question: "What is the primary goal of the 'Data Preparation' stage in the Data Science Life Cycle?", options: ["To build a machine learning model", "To clean, handle missing values, and transform data", "To define the business problem", "To present the final results to stakeholders"], answer: "To clean, handle missing values, and transform data", explanation: "Data Preparation focuses on creating a high-quality, usable dataset for modeling and analysis." }
        ];
        let currentQuestionIndex = 0;
        let score = 0;

        function startQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            document.getElementById('quiz-results').classList.add('hidden');
            document.getElementById('quiz-references').classList.add('hidden');
            displayQuestion();
        }

        function displayQuestion() {
            const quizArea = document.getElementById('quiz-area');
            if (currentQuestionIndex < quizQuestions.length) {
                const q = quizQuestions[currentQuestionIndex];
                let optionsHtml = q.options.map(option => `<button class="quiz-option" onclick="checkAnswer(this, '${option}', '${q.answer}', \`${q.explanation}\`)">${option}</button>`).join('');
                quizArea.innerHTML = `<h4 class="text-lg font-semibold">${currentQuestionIndex + 1}. ${q.question}</h4><div class="mt-2">${optionsHtml}</div>`;
            } else {
                showQuizResults();
            }
        }
        
        function checkAnswer(button, selected, correct, explanation) {
            const options = button.parentElement.children;
            for(let opt of options) { opt.disabled = true; }
            if (selected === correct) {
                score++;
                button.classList.add('correct');
            } else {
                button.classList.add('incorrect');
                for(let opt of options) { if(opt.innerText === correct) { opt.classList.add('correct'); } }
            }
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'mt-4 p-3 rounded-md ' + (selected === correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800');
            explanationDiv.innerHTML = `<strong>Explanation:</strong> ${explanation}`;
            button.parentElement.appendChild(explanationDiv);
            setTimeout(() => { currentQuestionIndex++; displayQuestion(); }, 3000);
        }

        function showQuizResults() {
             const quizArea = document.getElementById('quiz-area');
             quizArea.innerHTML = '';
             const resultsDiv = document.getElementById('quiz-results');
             resultsDiv.classList.remove('hidden');
             resultsDiv.innerHTML = `<h3 class="text-xl font-bold">Quiz Complete!</h3><p class="text-2xl mt-2">Your score: <span class="font-bold text-indigo-600">${score}</span> out of <span class="font-bold text-indigo-600">${quizQuestions.length}</span></p><button class="btn mt-4" onclick="startQuiz()">Try Again</button>`;
             document.getElementById('quiz-references').classList.remove('hidden');
        }

        // --- UTILITY FUNCTIONS ---
        function generateCodeBlock(code) {
             const codeId = `code-${Date.now()}`;
             const escapedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
             return `<div class="code-block"><button class="copy-btn" onclick="copyCode('${codeId}')">Copy</button><pre><code id="${codeId}">${escapedCode.trim()}</code></pre></div>`;
        }
        function copyCode(elementId) {
            const codeElement = document.getElementById(elementId);
            const textArea = document.createElement('textarea');
            textArea.value = codeElement.innerText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Code copied!');
        }
        
        // --- Initial Load ---
        window.onload = () => {
            showSection('course');
        };
    </script>
</body>
</html>
