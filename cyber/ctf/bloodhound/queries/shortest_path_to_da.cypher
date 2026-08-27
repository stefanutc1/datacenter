MATCH (u:User)-[r:MemberOf*1..]->(g:Group)
WHERE g.name =~ '(?i)DOMAIN ADMINS.*'
RETURN u.name, g.name, shortestPath((u)-[*]->(g))
