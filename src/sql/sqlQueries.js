const getLaunchProperty= `
WITH RankedImages AS (
    SELECT 
        I.image_url,
        I.property_id,
        ROW_NUMBER() OVER (PARTITION BY I.property_id ORDER BY I.image_url) AS rn
    FROM 
        image I
)
SELECT top 100
    d.developer_name,
    RI.image_url,
    p.*
FROM 
    property p
LEFT JOIN 
    developer d ON p.developer_id = d.developer_id 
LEFT JOIN 
    RankedImages RI ON p.property_id = RI.property_id AND RI.rn = 1
WHERE 
    p.status in ('Completed','Launch') and p.property_id in(15,16,40,43,45,56,88,91,104,132)`

const getLatestProperty=`
WITH RankedImages AS (
    SELECT 
        I.image_url,
        I.property_id,
        ROW_NUMBER() OVER (PARTITION BY I.property_id ORDER BY I.image_url) AS rn
    FROM 
        image I
)
SELECT top 100
    d.developer_name,
    RI.image_url,
    p.*
FROM 
    property p
LEFT JOIN 
    developer d ON p.developer_id = d.developer_id 
LEFT JOIN 
    RankedImages RI ON p.property_id = RI.property_id AND RI.rn = 1
WHERE 
	p.property_id in (1,7,13,43,61,173,104,125)

`
const getUnderConstructionProperty=`
WITH RankedImages AS (
    SELECT 
        I.image_url,
        I.property_id,
        ROW_NUMBER() OVER (PARTITION BY I.property_id ORDER BY I.image_url) AS rn
    FROM 
        image I
)
SELECT top 100
    d.developer_name,
    RI.image_url,
    p.*
FROM 
    property p
LEFT JOIN 
    developer d ON p.developer_id = d.developer_id 
LEFT JOIN 
    RankedImages RI ON p.property_id = RI.property_id AND RI.rn = 1
WHERE 
    p.status in ('Under Construction') and p.property_id in(85,10,11,17,20,50,61,8,125,192)
`

const getPropertyByDeveloperId =
`
WITH RankedImages AS (
    SELECT 
        I.image_url,
        I.property_id,
        ROW_NUMBER() OVER (PARTITION BY I.property_id ORDER BY I.image_url) AS rn
    FROM 
        image I
)
SELECT top 100
    d.developer_name,
    RI.image_url,
    p.*
FROM 
    property p
LEFT JOIN 
    developer d ON p.developer_id = d.developer_id 
LEFT JOIN 
    RankedImages RI ON p.property_id = RI.property_id AND RI.rn = 1
WHERE 
    d.developer_id= @developer_id
`

getDeveoperById=
`select p.property_id,p.property_name,d.* from property p right join developer d on p.developer_id = d.developer_id where d.developer_id =@developer_id
`
getPropertyById=
` select d.developer_name,p.* from property p left join developer d on p.developer_id = d.developer_id where p.property_id =@property_id
`
getcities =
`
SELECT 
  Distinct TRIM(RIGHT(address, CHARINDEX(' ', REVERSE(address)) - 1)) AS city
FROM property
`

getPropertyByCity=
`
WITH RankedImages AS (
    SELECT 
        I.image_url,
        I.property_id,
        ROW_NUMBER() OVER (PARTITION BY I.property_id ORDER BY I.image_url) AS rn
    FROM 
        image I
)
SELECT top 15
    d.developer_name,
    RI.image_url,
    p.*
FROM 
    property p
LEFT JOIN 
    developer d ON p.developer_id = d.developer_id 
LEFT JOIN 
    RankedImages RI ON p.property_id = RI.property_id AND RI.rn = 1 
WHERE address LIKE @city
ORDER BY 
CASE 
        WHEN launch_date IS NULL OR LEN(launch_date) < 6 THEN '2000-01-01'
        ELSE CAST(
        '20' + RIGHT(launch_date, 2) + '-' + 
        CASE LEFT(launch_date, 3)
            WHEN 'Jan' THEN '01'
            WHEN 'Feb' THEN '02'
            WHEN 'Mar' THEN '03'
            WHEN 'Apr' THEN '04'
            WHEN 'May' THEN '05'
            WHEN 'Jun' THEN '06'
            WHEN 'Jul' THEN '07'
            WHEN 'Aug' THEN '08'
            WHEN 'Sep' THEN '09'
            WHEN 'Oct' THEN '10'
            WHEN 'Nov' THEN '11'
            WHEN 'Dec' THEN '12'
			ELSE '01' -- Default case for any unexpected month abbreviation

        END + '-01' AS DATE
    )END DESC;
`

module.exports={
getLaunchProperty,
getLatestProperty,
getUnderConstructionProperty,
getPropertyByDeveloperId,
getDeveoperById,
getPropertyById,
getcities,
getPropertyByCity
}