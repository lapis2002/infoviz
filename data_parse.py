import pandas as pd
import sys

def groupBusinesses(df, mainCats):
    '''
    Food&Beverage: Food, Liquor
    Entertainment
    Retail: Retail
    Wholesale: wholesale
    Automotive: Automotive
    Business Services: Business Services, Photographic Services
    Personal Service: Personal Service
    Transportation: Transportation, Delivery Service, Parking
    Research&Development: Research & Development, Marine
    Entertainment: Cannabis Related, Recreation
    Non Profit: Non Profit
    Accomodation: Non-transient Accomodation, Transient Accomodation,
    Professional: Professional 
    Computer Services: Computer Services, Repair Services
    Financial: Financial
    Industrial: Industrial, Manufacturing
    Other Services: Other Services, Support Services
    Other
    
    Not sure how should I group these?
    Education,43
    Rentals,36
    Contractor,141
    Broadcasting,6
    Care Facility,4
    Day Care,35
    Management,14
    '''
    for i, row in df.iterrows():
        df[i, df.columns.get_loc('Category')] = mainCats[row.Category]
    return

def parseBusinessesByYearCategory(df, year):
    """parsing the dataframe to the number of open business on that year and 
    closed businesses (open last year but not this year)
    """
    df_prevyear = df[df['IssuedYear']==year-1]
    df_year = df[df['IssuedYear']==year]
    
    prev_categories = set(df_prevyear['Category'])
    cur_categories = set(df_year['Category'])

    categories = prev_categories + cur_categories
    
    prev_companies = {}
    for cat in categories:
        prev_companies[cat] = set(df_prevyear[df_prevyear["Category"] == cat]["Name"])
        
    cur_companies = {}
    for cat in categories:
        cur_companies[cat] = set(df_year[df_year["Category"] == cat]["Name"])
        
    new_open_businesses = {}
    close_businesses = {}
    for cat in categories:
        # set operations
        closed = prev_companies[cat] - cur_companies[cat] # business open last year but not this year
        close_businesses[cat] = len(closed)
        new_open_businesses[cat] = len(cur_companies[cat] - prev_companies[cat]) # appear this year but not last year
            
    # create new dataframe
    categories_col = []
    opens_col = []
    new_opens_col = []
    closes_col = []
    years_col = []
    for cat in categories:
        categories_col.append(cat)
        opens_col.append(len(cur_companies[cat]))
        new_opens_col.append(new_open_businesses[cat])
        closes_col.append(close_businesses[cat])
        years.append(year)
            
    returned_df = pd.DataFrame({
        "Year": years_col,
        "Category": categories_col,
        "New Open Bussiness": new_opens_col,
        "Open Business": opens_col,
        "Close Business": closes_col
    })
    return returned_df

def parseBusinesesByCategoryNeghbourhood(df, neighbourhood):
    return df[df['Neighbourhood']==neighbourhood]

def parseBusinesesByYearCategoryNeghbourhood(df, year, neighbourhood):
    neigh_df = parseBusinesesByCategoryNeghbourhood(df, neighbourhood)
    return parseBusinessesByYearCategory(neigh_df, year)


def parseBusinessesCovidTime(df):
    return

def parseBusinessesPreCovidTime(df):
    return

def parseBusinessesPostCovidTime(df):
    return

businesses = pd.read_csv("victoria_data.csv")
##! Testing
# for i, row in businesses.iterrows():
#     # print(businesses.at['Category',i])
#     businesses.iloc[i, businesses.columns.get_loc('Neighbourhood')=='Fairfield'] = "2"
    
# print(businesses.head())
# test = businesses[businesses['Neighbourhood']=='Fairfield']
# # test["t"] = 2
# a = set(test['Category'][test['Name'] == 'FEAR ON THE PIER'])
# b = test[test['Name'] == 'LISA HELPS VICTORIA']
# print(len(b))
print(set(businesses[businesses["Category"] == "Entertainment"]["Name"]))

print((businesses[businesses["Category"] == "Entertainment"]))



