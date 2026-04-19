(.venv) PS C:\INTERNSHIP\rag\ragfood> python test.py                                                                                             
⏩ Skipping upsert (already done)

🧠 RAG is ready. Ask a question (type 'exit' to quit):


🚀 Running RAG Evaluation with LLM...

🔎 Test: Semantic Similarity
Query: Mediterranean options

📦 Raw Results: [QueryResult(id='2', score=0.033333335, vector=None, metadata={'name': 'Grilled Mediterranean Vegetables', 'category': 'World Cuisine', 'ingredients': ['zucchini', 'eggplant', 'peppers', 'olive oil'], 'cooking_method': 'Grilled', 'nutrition': 'High fiber, low calorie', 'cultural_background': 'Mediterranean cuisine', 'dietary_tags': ['vegan', 'low-carb'], 'allergens': []}, data='Grilled Mediterranean vegetables include zucchini, eggplant, and peppers cooked with olive oil. This healthy Mediterranean dish is low in calories and high in fiber and antioxidants. Grilling enhances flavor while preserving nutrients. It is commonly served across Mediterranean countries as a side or main dish. Variations include herbs and spices such as oregano or thyme, making it a versatile and nutritious option.', sparse_vector=None), QueryResult(id='1', score=0.032522473, vector=None, metadata={'name': 'Greek Salad', 'category': 'World Cuisine', 'ingredients': ['tomatoes', 'cucumber', 'olives', 'feta', 'olive oil'], 'cooking_method': 'No-cook', 'nutrition': 'Low-carb, rich in healthy fats and antioxidants', 'cultural_background': 'Greek Mediterranean cuisine', 'dietary_tags': ['vegetarian', 'low-carb'], 'allergens': ['dairy']}, data='Greek salad is a classic Mediterranean dish made with tomatoes, cucumbers, olives, feta cheese, and olive oil. This healthy Mediterranean option is widely consumed in Greece and reflects the Mediterranean diet known for heart health. It is low in carbohydrates, rich in antioxidants, and contains healthy fats. Variations include removing cheese for vegan diets or adding herbs for flavor. It is commonly served as a refreshing side dish or a light main meal.', sparse_vector=None), QueryResult(id='8', score=0.03201844, vector=None, metadata={'name': 'Ratatouille', 'category': 'World Cuisine', 'ingredients': ['eggplant', 'zucchini', 'tomatoes'], 'cooking_method': 'Slow-cooked', 'nutrition': 'High antioxidants', 'cultural_background': 'French Mediterranean cuisine', 'dietary_tags': ['vegan'], 'allergens': []}, data='Ratatouille is a Mediterranean French vegetable dish made by slow-cooking vegetables like eggplant and zucchini. It is rich in antioxidants and fiber. This dish reflects Mediterranean cooking styles and is widely consumed in France.', sparse_vector=None)]

📚 Context:
 Name: Grilled Mediterranean Vegetables
Category: World Cuisine

Description: Grilled Mediterranean vegetables include zucchini, eggplant, and peppers cooked with olive oil. This healthy Mediterranean dish is low in calories and high in fiber and antioxidants. Grilling enhances flavor while preserving nutrients. It is commonly served across Mediterranean countries as a side or main dish. Variations include herbs and spices such as oregano or thyme, making it a versatile and nutritious option.

Ingredients: zucchini, eggplant, peppers, olive oil
Nutrition: High fiber, low calorie
Dietary: vegan, low-carb

Name: Greek Salad
Category: World Cuisine

Description: Greek salad is a classic Mediterranean dish made with tomatoes, cucumbers, olives, feta cheese, and olive oil. This healthy Mediterranean option is widely consumed in Greece and reflects the Mediterranean diet known for heart health. It is low in carbohydrates, rich in antioxidants, and contains healthy fats. Variations include removing cheese for vegan diets or adding herbs for flavor. It is commonly served as a refreshing side dish or a light main meal.

Ingredients: tomatoes, cucumber, olives, feta, olive oil
Nutrition: Low-carb, rich in healthy fats and antioxidants
Dietary: vegetarian, low-carb

Name: Ratatouille
Category: World Cuisine

Description: Ratatouille is a Mediterranean French vegetable dish made by slow-cooking vegetables like eggplant and zucchini. It is rich in antioxidants and fiber. This dish reflects Mediterranean cooking styles and is widely consumed in France.

Ingredients: eggplant, zucchini, tomatoes
Nutrition: High antioxidants
Dietary: vegan

🤖 Answer:
**Mediterranean options from the provided context**

1. **Grilled Mediterranean Vegetables**  
   - *Category*: World Cuisine  
   - *Key ingredients*: zucchini, eggplant, peppers, olive oil  
   - *Dietary notes*: vegan, low‑carb; high fiber, low calorie  

2. **Greek Salad**  
   - *Category*: World Cuisine  
   - *Key ingredients*: tomatoes, cucumber, olives, feta, olive oil  
   - *Dietary notes*: vegetarian, low‑carb; rich in healthy fats and antioxidants  

3. **Ratatouille**  
   - *Category*: World Cuisine  
   - *Key ingredients*: eggplant, zucchini, tomatoes  
   - *Dietary notes*: vegan; high antioxidants  

📊 LLM Score: 7.0/10
🧠 Evaluation:
Score: 7
Reason: The answer is relevant—it lists Mediterranean dishes with appropriate details—but it offers only a limited selection and lacks broader coverage or deeper explanation, making it only partially complete. The information given is accurate, though the briefness and omission of additional options reduce its overall completeness.
⏱️ Response Time: 1.99 sec
------------------------------------------------------------
🔎 Test: Multi-Criteria
Query: spicy vegetarian Asian dishes

📦 Raw Results: [QueryResult(id='3', score=0.033333335, vector=None, metadata={'name': 'Spicy Tofu Stir Fry', 'category': 'World Cuisine', 'ingredients': ['tofu', 'chili', 'vegetables'], 'cooking_method': 'Stir-fried', 'nutrition': 'High protein, low fat', 'cultural_background': 'Asian cuisine', 'dietary_tags': ['vegan', 'vegetarian', 'spicy'], 'allergens': ['soy']}, data='Spicy tofu stir fry is a vegetarian Asian dish made with tofu, chili, garlic, and vegetables. This spicy vegetarian Asian dish is high in plant-based protein and low in fat. It is commonly prepared in Chinese and Southeast Asian cuisines using high heat to retain nutrients and flavor. Variations include different sauces and vegetables, making it a flexible and nutritious meal.', sparse_vector=None), QueryResult(id='4', score=0.032786883, vector=None, metadata={'name': 'Vegetable Thai Curry', 'category': 'World Cuisine', 'ingredients': ['vegetables', 'coconut milk', 'curry paste'], 'cooking_method': 'Simmered', 'nutrition': 'Rich in vitamins and healthy fats', 'cultural_background': 'Thai cuisine', 'dietary_tags': ['vegan', 'spicy'], 'allergens': []}, data='Vegetable Thai curry is a spicy vegetarian Asian dish made with coconut milk, curry paste, and vegetables. It is rich in flavor and nutrients, providing vitamins and healthy fats. This dish is widely consumed in Thailand and reflects traditional cooking techniques. Variations include adjusting spice levels or adding tofu for protein, making it adaptable to different diets.', sparse_vector=None), QueryResult(id='6', score=0.031513646, vector=None, metadata={'name': 'Falafel', 'category': 'World Cuisine', 'ingredients': ['chickpeas', 'spices'], 'cooking_method': 'Deep-fried', 'nutrition': 'High fiber and protein', 'cultural_background': 'Middle Eastern cuisine', 'dietary_tags': ['vegetarian'], 'allergens': ['gluten']}, data='Falafel is a Middle Eastern dish made from ground chickpeas and spices, deep-fried into balls or patties. It is rich in plant protein and fiber, making it a popular vegetarian option. This dish is widely consumed across Mediterranean and Middle Eastern regions with many variations in spices and preparation.', sparse_vector=None)]

📚 Context:
 Name: Spicy Tofu Stir Fry
Category: World Cuisine

Description: Spicy tofu stir fry is a vegetarian Asian dish made with tofu, chili, garlic, and vegetables. This spicy vegetarian Asian dish is high in plant-based protein and low in fat. It is commonly prepared in Chinese and Southeast Asian cuisines using high heat to retain nutrients and flavor. Variations include different sauces and vegetables, making it a flexible and nutritious meal.

Ingredients: tofu, chili, vegetables
Nutrition: High protein, low fat
Dietary: vegan, vegetarian, spicy

Name: Vegetable Thai Curry
Category: World Cuisine

Description: Vegetable Thai curry is a spicy vegetarian Asian dish made with coconut milk, curry paste, and vegetables. It is rich in flavor and nutrients, providing vitamins and healthy fats. This dish is widely consumed in Thailand and reflects traditional cooking techniques. Variations include adjusting spice levels or adding tofu for protein, making it adaptable to different diets.

Ingredients: vegetables, coconut milk, curry paste
Nutrition: Rich in vitamins and healthy fats
Dietary: vegan, spicy

Name: Falafel
Category: World Cuisine

Description: Falafel is a Middle Eastern dish made from ground chickpeas and spices, deep-fried into balls or patties. It is rich in plant protein and fiber, making it a popular vegetarian option. This dish is widely consumed across Mediterranean and Middle Eastern regions with many variations in spices and preparation.

Ingredients: chickpeas, spices
Nutrition: High fiber and protein
Dietary: vegetarian

🤖 Answer:
**Spicy vegetarian Asian dishes**

1. **Spicy Tofu Stir Fry**  
   - *Description*: A vegetarian Asian dish made with tofu, chili, garlic, and vegetables. It’s high in plant‑based protein and low in fat, prepared with high heat to retain nutrients and flavor.  
   - *Dietary*: vegan, vegetarian, spicy  

2. **Vegetable Thai Curry**  
   - *Description*: A spicy vegetarian Asian dish featuring coconut milk, curry paste, and vegetables. It’s rich in vitamins and healthy fats, with adjustable spice levels.  
   - *Dietary*: vegan, spicy  

📊 LLM Score: 6.0/10
🧠 Evaluation:
Score: 6
Reason: The answer is relevant and the brief descriptions of the two dishes are generally accurate, but it is not very complete—only two examples are given when the prompt likely expects a broader list of spicy vegetarian Asian dishes.
⏱️ Response Time: 1.42 sec
------------------------------------------------------------
🔎 Test: Nutritional
Query: high-protein low-carb foods

📦 Raw Results: [QueryResult(id='11', score=0.033333335, vector=None, metadata={'name': 'Grilled Chicken', 'category': 'Healthy', 'ingredients': ['chicken', 'spices'], 'cooking_method': 'Grilled', 'nutrition': 'High protein', 'cultural_background': 'Global cuisine', 'dietary_tags': ['low-carb'], 'allergens': []}, data='Grilled chicken is a high-protein low-carb food widely consumed in healthy diets. It is prepared by grilling seasoned chicken, making it flavorful and nutritious. It supports muscle growth and weight management.', sparse_vector=None), QueryResult(id='9', score=0.032786883, vector=None, metadata={'name': 'Grilled Salmon', 'category': 'Healthy', 'ingredients': ['salmon', 'lemon'], 'cooking_method': 'Grilled', 'nutrition': 'High protein, omega-3', 'cultural_background': 'Global cuisine', 'dietary_tags': ['low-carb'], 'allergens': ['fish']}, data='Grilled salmon is a high-protein low-carb food rich in omega-3 fatty acids. This healthy dish supports heart health and muscle growth. It is prepared by grilling salmon with herbs and lemon. It is widely consumed globally.', sparse_vector=None), QueryResult(id='10', score=0.032258064, vector=None, metadata={'name': 'Egg White Omelette', 'category': 'Healthy', 'ingredients': ['egg whites', 'vegetables'], 'cooking_method': 'Pan-cooked', 'nutrition': 'High protein', 'cultural_background': 'Global cuisine', 'dietary_tags': ['low-carb'], 'allergens': ['egg']}, data='Egg white omelette is a high-protein low-carb food made from egg whites and vegetables. It supports muscle building and weight loss. It is commonly used in fitness diets and is low in calories.', sparse_vector=None)]

📚 Context:
 Name: Grilled Chicken
Category: Healthy

Description: Grilled chicken is a high-protein low-carb food widely consumed in healthy diets. It is prepared by grilling seasoned chicken, making it flavorful and nutritious. It supports muscle growth and weight management.

Ingredients: chicken, spices
Nutrition: High protein
Dietary: low-carb

Name: Grilled Salmon
Category: Healthy

Description: Grilled salmon is a high-protein low-carb food rich in omega-3 fatty acids. This healthy dish supports heart health and muscle growth. It is prepared by grilling salmon with herbs and lemon. It is widely consumed globally.

Ingredients: salmon, lemon
Nutrition: High protein, omega-3
Dietary: low-carb

Name: Egg White Omelette
Category: Healthy

Description: Egg white omelette is a high-protein low-carb food made from egg whites and vegetables. It supports muscle building and weight loss. It is commonly used in fitness diets and is low in calories.

Ingredients: egg whites, vegetables
Nutrition: High protein
Dietary: low-carb

🤖 Answer:
- Grilled Chicken  
- Grilled Salmon  
- Egg White Omelette

📊 LLM Score: 6.0/10
🧠 Evaluation:
Score: 6
Reason: The answer is relevant and factually correct, listing foods that are indeed high in protein and low in carbs. However, it is not comprehensive; the question likely expects a broader selection or additional details (e.g., other protein sources, nutritional values, tips), so the response is incomplete.
⏱️ Response Time: 1.07 sec
------------------------------------------------------------
🔎 Test: Cultural Exploration
Query: traditional comfort foods

📦 Raw Results: [QueryResult(id='15', score=0.03306011, vector=None, metadata={'name': 'Mac and Cheese', 'category': 'Comfort Food', 'ingredients': ['pasta', 'cheese'], 'cooking_method': 'Baked', 'nutrition': 'High carbs', 'cultural_background': 'Western cuisine', 'dietary_tags': ['vegetarian'], 'allergens': ['dairy']}, data='Mac and cheese is a traditional comfort food made with pasta and cheese sauce. It is creamy and satisfying and widely enjoyed in Western cuisine.', sparse_vector=None), QueryResult(id='17', score=0.03306011, vector=None, metadata={'name': 'Lasagna', 'category': 'Comfort Food', 'ingredients': ['pasta', 'meat', 'cheese'], 'cooking_method': 'Baked', 'nutrition': 'High protein', 'cultural_background': 'Italian cuisine', 'dietary_tags': ['non-vegetarian'], 'allergens': ['dairy']}, data='Lasagna is a traditional Italian comfort food made with layers of pasta, meat, and cheese. It is rich and filling and commonly served during gatherings.', sparse_vector=None), QueryResult(id='20', score=0.032002047, vector=None, metadata={'name': 'Ramen', 'category': 'Comfort Food', 'ingredients': ['noodles', 'broth'], 'cooking_method': 'Boiled', 'nutrition': 'Energy-rich', 'cultural_background': 'Japanese cuisine', 'dietary_tags': ['non-vegetarian'], 'allergens': ['gluten']}, data='Ramen is a Japanese comfort food consisting of noodles in broth with toppings. It is warm, filling, and widely enjoyed.', sparse_vector=None)]

📚 Context:
 Name: Mac and Cheese
Category: Comfort Food

Description: Mac and cheese is a traditional comfort food made with pasta and cheese sauce. It is creamy and satisfying and widely enjoyed in Western cuisine.

Ingredients: pasta, cheese
Nutrition: High carbs
Dietary: vegetarian

Name: Lasagna
Category: Comfort Food

Description: Lasagna is a traditional Italian comfort food made with layers of pasta, meat, and cheese. It is rich and filling and commonly served during gatherings.

Ingredients: pasta, meat, cheese
Nutrition: High protein
Dietary: non-vegetarian

Name: Ramen
Category: Comfort Food

Description: Ramen is a Japanese comfort food consisting of noodles in broth with toppings. It is warm, filling, and widely enjoyed.

Ingredients: noodles, broth
Nutrition: Energy-rich
Dietary: non-vegetarian

🤖 Answer:
**Traditional Comfort Foods**

- **Mac and Cheese** – A classic comfort dish made with pasta and cheese sauce; creamy and satisfying.  
- **Lasagna** – An Italian comfort favorite featuring layers of pasta, meat, and cheese; rich and filling.  
- **Ramen** – A Japanese comfort staple of noodles served in broth with various toppings; warm and filling.

📊 LLM Score: 6.0/10
🧠 Evaluation:
Score: 6
Reason: The answer is relevant and correctly identifies three well‑known comfort foods, but it is brief and omits many other traditional options, lacking depth and breadth for a complete response.
⏱️ Response Time: 1.26 sec
------------------------------------------------------------
🔎 Test: Cooking Method
Query: dishes that can be grilled

📦 Raw Results: [QueryResult(id='9', score=0.03306011, vector=None, metadata={'name': 'Grilled Salmon', 'category': 'Healthy', 'ingredients': ['salmon', 'lemon'], 'cooking_method': 'Grilled', 'nutrition': 'High protein, omega-3', 'cultural_background': 'Global cuisine', 'dietary_tags': ['low-carb'], 'allergens': ['fish']}, data='Grilled salmon is a high-protein low-carb food rich in omega-3 fatty acids. This healthy dish supports heart health and muscle growth. It is prepared by grilling salmon with herbs and lemon. It is widely consumed globally.', sparse_vector=None), QueryResult(id='2', score=0.032795697, vector=None, metadata={'name': 'Grilled Mediterranean Vegetables', 'category': 'World Cuisine', 'ingredients': ['zucchini', 'eggplant', 'peppers', 'olive oil'], 'cooking_method': 'Grilled', 'nutrition': 'High fiber, low calorie', 'cultural_background': 'Mediterranean cuisine', 'dietary_tags': ['vegan', 'low-carb'], 'allergens': []}, data='Grilled Mediterranean vegetables include zucchini, eggplant, and peppers cooked with olive oil. This healthy Mediterranean dish is low in calories and high in fiber and antioxidants. Grilling enhances flavor while preserving nutrients. It is commonly served across Mediterranean countries as a side or main dish. Variations include herbs and spices such as oregano or thyme, making it a versatile and nutritious option.', sparse_vector=None), QueryResult(id='11', score=0.032522473, vector=None, metadata={'name': 'Grilled Chicken', 'category': 'Healthy', 'ingredients': ['chicken', 'spices'], 'cooking_method': 'Grilled', 'nutrition': 'High protein', 'cultural_background': 'Global cuisine', 'dietary_tags': ['low-carb'], 'allergens': []}, data='Grilled chicken is a high-protein low-carb food widely consumed in healthy diets. It is prepared by grilling seasoned chicken, making it flavorful and nutritious. It supports muscle growth and weight management.', sparse_vector=None)]

📚 Context:
 Name: Grilled Salmon
Category: Healthy

Description: Grilled salmon is a high-protein low-carb food rich in omega-3 fatty acids. This healthy dish supports heart health and muscle growth. It is prepared by grilling salmon with herbs and lemon. It is widely consumed globally.

Ingredients: salmon, lemon
Nutrition: High protein, omega-3
Dietary: low-carb

Name: Grilled Mediterranean Vegetables
Category: World Cuisine

Description: Grilled Mediterranean vegetables include zucchini, eggplant, and peppers cooked with olive oil. This healthy Mediterranean dish is low in calories and high in fiber and antioxidants. Grilling enhances flavor while preserving nutrients. It is commonly served across Mediterranean countries as a side or main dish. Variations include herbs and spices such as oregano or thyme, making it a versatile and nutritious option.

Ingredients: zucchini, eggplant, peppers, olive oil
Nutrition: High fiber, low calorie
Dietary: vegan, low-carb

Name: Grilled Chicken
Category: Healthy

Description: Grilled chicken is a high-protein low-carb food widely consumed in healthy diets. It is prepared by grilling seasoned chicken, making it flavorful and nutritious. It supports muscle growth and weight management.

Ingredients: chicken, spices
Nutrition: High protein
Dietary: low-carb

🤖 Answer:
- Grilled Salmon  
- Grilled Mediterranean Vegetables  
- Grilled Chicken

📊 LLM Score: 7.0/10
🧠 Evaluation:
Score: 7
Reason: The answer is relevant and correctly lists dishes that can be grilled, but it is far from exhaustive, providing only three examples for a question that invites a broader list.
⏱️ Response Time: 1.09 sec
------------------------------------------------------------

📈 FINAL SUMMARY
==================================================
Semantic Similarity:
  ⏱️ Time: 1.99s
  📊 Score: 7.0/10

Multi-Criteria:
  ⏱️ Time: 1.42s
  📊 Score: 6.0/10

Nutritional:
  ⏱️ Time: 1.07s
  📊 Score: 6.0/10

Cultural Exploration:
  ⏱️ Time: 1.26s
  📊 Score: 6.0/10

Cooking Method:
  ⏱️ Time: 1.09s
  📊 Score: 7.0/10

🔥 Overall Performance:
Average Response Time: 1.37s
Average LLM Score: 6.4/10