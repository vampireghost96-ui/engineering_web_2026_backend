#!/bin/bash

echo "====== TESTING AUTHENTICATION ON ALL POST/PUT/DELETE ENDPOINTS ======"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"

# Step 1: Login to get token
echo -e "${YELLOW}[STEP 1] Getting admin token...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "superadmin",
    "password": "Admin@12345"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Failed to get token${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Token obtained: ${TOKEN:0:20}...${NC}"
echo ""

# Test helper function
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  local data=$4
  local needs_token=$5

  echo -e "${YELLOW}Testing: $description${NC}"
  
  # Test WITHOUT token
  echo -n "  WITHOUT token: "
  RESPONSE=$(curl -s -X $method "$BASE_URL$endpoint" \
    -H "Content-Type: application/json" \
    -d "$data")
  
  if echo $RESPONSE | grep -q "401\|Access token\|Unauthorized"; then
    echo -e "${GREEN}✓ Properly rejected (401)${NC}"
  else
    echo -e "${RED}✗ NOT rejected - Response: $RESPONSE${NC}"
  fi
  
  # Test WITH token
  echo -n "  WITH token: "
  RESPONSE=$(curl -s -X $method "$BASE_URL$endpoint" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$data")
  
  if echo $RESPONSE | grep -q "400\|success\|201\|200\|_id\|id"; then
    echo -e "${GREEN}✓ Accepted (processed)${NC}"
  else
    echo -e "${YELLOW}⚠ Unexpected response: ${RESPONSE:0:50}...${NC}"
  fi
  
  echo ""
}

# ============== SERVICE ENDPOINTS ==============
echo -e "${YELLOW}========== SERVICES ===========${NC}"

test_endpoint "POST" "/api/admin/services" \
  "POST /api/admin/services (CREATE)" \
  '{"title":"Test Service","description":"Test Description","price":99.99}'

test_endpoint "PUT" "/api/admin/services/1" \
  "PUT /api/admin/services/:id (UPDATE)" \
  '{"title":"Updated Service","description":"Updated Description"}'

test_endpoint "DELETE" "/api/admin/services/1" \
  "DELETE /api/admin/services/:id (DELETE)" \
  '{}' 

# ============== CATEGORY ENDPOINTS ==============
echo -e "${YELLOW}========== CATEGORIES ===========${NC}"

test_endpoint "POST" "/api/admin/categories" \
  "POST /api/admin/categories (CREATE)" \
  '{"name":"Test Category","description":"Test Description"}'

test_endpoint "PUT" "/api/admin/categories/1" \
  "PUT /api/admin/categories/:id (UPDATE)" \
  '{"name":"Updated Category","description":"Updated"}'

test_endpoint "DELETE" "/api/admin/categories/1" \
  "DELETE /api/admin/categories/:id (DELETE)" \
  '{}'

# ============== PROJECT ENDPOINTS ==============
echo -e "${YELLOW}========== PROJECTS ===========${NC}"

test_endpoint "POST" "/api/admin/projects" \
  "POST /api/admin/projects (CREATE)" \
  '{"title":"Test Project","description":"Test","categoryId":1,"images":[]}'

test_endpoint "PUT" "/api/admin/projects/1" \
  "PUT /api/admin/projects/:id (UPDATE)" \
  '{"title":"Updated Project","description":"Updated"}'

test_endpoint "DELETE" "/api/admin/projects/1" \
  "DELETE /api/admin/projects/:id (DELETE)" \
  '{}'

# ============== CONTACT FORM ENDPOINTS ==============
echo -e "${YELLOW}========== CONTACT FORMS (ADMIN MANAGEMENT) ===========${NC}"

test_endpoint "DELETE" "/api/admin/contact-forms/1" \
  "DELETE /api/admin/contact-forms/:id (DELETE)" \
  '{}'

echo ""
echo -e "${GREEN}====== TEST COMPLETE ======${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "✓ All POST endpoints should reject requests WITHOUT token (401)"
echo "✓ All POST endpoints should accept requests WITH token"
echo "✓ All PUT endpoints should reject requests WITHOUT token (401)"
echo "✓ All PUT endpoints should accept requests WITH token"
echo "✓ All DELETE endpoints should reject requests WITHOUT token (401)"
echo "✓ All DELETE endpoints should accept requests WITH token"
