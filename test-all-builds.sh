#!/bin/bash

# Test build script for all microservices
# This script will build each service and report the results

echo "🚀 Testing builds for all microservices..."
echo "==========================================="
echo ""

services="dashboard lookups sales hr recruiting stock notifications reports chatbot personalarea"
failed=""
succeeded=""
total=0
success_count=0

for service in $services; do
  total=$((total + 1))
  echo "[$total/10] 📦 Building $service..."
  
  if [ "$service" = "lookups" ]; then
    dir="portaal-fe-lookUps"
  else
    dir="portaal-fe-$service"
  fi
  
  cd "/home/mverde/src/taal/portaal-fe-full/$dir"
  
  # Run build and capture output
  yarn build > build.log 2>&1
  
  if [ $? -eq 0 ]; then
    # Check if dist folder exists and has files
    if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
      size=$(du -sh dist | cut -f1)
      echo "   ✅ $service built successfully (dist size: $size)"
      succeeded="$succeeded $service"
      success_count=$((success_count + 1))
    else
      echo "   ⚠️  $service build completed but dist is empty"
      failed="$failed $service"
    fi
  else
    echo "   ❌ $service build failed"
    echo "   Last error:"
    tail -5 build.log | sed 's/^/      /'
    failed="$failed $service"
  fi
  
  cd - > /dev/null
  echo ""
done

echo "==========================================="
echo "📊 Build Summary:"
echo "   Total services: $total"
echo "   ✅ Successful: $success_count"
echo "   ❌ Failed: $((total - success_count))"
echo ""

if [ -n "$succeeded" ]; then
  echo "✅ Succeeded:$succeeded"
fi

if [ -n "$failed" ]; then
  echo "❌ Failed:$failed"
fi

echo ""
echo "✨ Build test completed!"

# Return non-zero if any builds failed
if [ $success_count -eq $total ]; then
  exit 0
else
  exit 1
fi